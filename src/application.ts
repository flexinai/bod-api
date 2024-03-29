import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {DbDataSource} from './datasources';
import {MySequence} from './sequence';
// ------ JWT authentication---------
import {AuthenticationComponent} from '@loopback/authentication';
import { 
  JWTAuthenticationComponent, 
  UserRepository, 
  UserServiceBindings 
} from '@loopback/authentication-jwt';
import {AppUserService} from './services/app-user-service'
import {AppUserRepository, AppUserCredentialsRepository} from './repositories'
// ----------------------------------

// --- Authentication ----
import {createBindingFromClass} from '@loopback/core';
import {toInterceptor} from '@loopback/rest';
import {AuthenticationComponent} from '@loopback/authentication';
import {
  CustomOauth2Interceptor,
  GoogleOauthInterceptor,
  SessionAuth,
} from './authentication-interceptors';
import {
  Oauth2AuthStrategy,
  GoogleOauth2Authentication,
  SessionStrategy,
} from './authentication-strategies';
import {
  CustomOauth2,
  CustomOauth2ExpressMiddleware,
  GoogleOauth,
  GoogleOauth2ExpressMiddleware,
} from './authentication-strategy-providers';
import {PassportUserIdentityService, UserServiceBindings} from './services';
import passport from 'passport';
// ----------------------
// Added CrudRestComponent for User controller
import {CrudRestComponent} from '@loopback/rest-crud';

export {ApplicationConfig};

export class BodApiApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // ---- Authentication ----

    // get oAuth configuration
    let oAuth2Providers = require('../oauth2-providers.json');
    oAuth2Providers['google-login'].clientID = process.env.CLIENT_ID;
    oAuth2Providers['google-login'].clientSecret = process.env.CLIENT_SECRET;

    this.setUpBindings();
    this.component(AuthenticationComponent);
    this.component(CrudRestComponent);

    this.bind('googleOAuth2Options').to(oAuth2Providers['google-login']);
    this.bind('customOAuth2Options').to(oAuth2Providers['oauth2']);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport.serializeUser(function (user: any, done) {
      done(null, user);
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport.deserializeUser(function (user: any, done) {
      done(null, user);
    });
    // -------------------------

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    // ------ JWT authentication---------
    // Mount authentication system
    this.component(AuthenticationComponent);
    // Mount jwt component
    this.component(JWTAuthenticationComponent);
    // Bind datasource
    this.dataSource(DbDataSource, UserServiceBindings.DATASOURCE_NAME);
    // Bind user service
    this.bind(UserServiceBindings.USER_SERVICE).toClass(AppUserService),
    // Bind user and credentials repository
    this.bind(UserServiceBindings.USER_REPOSITORY).toClass( AppUserRepository),
    this.bind(UserServiceBindings.USER_CREDENTIALS_REPOSITORY).toClass(
      AppUserCredentialsRepository,
    )
    // ---------------------------------
  }

  setUpBindings(): void {
    this.bind(UserServiceBindings.PASSPORT_USER_IDENTITY_SERVICE).toClass(
      PassportUserIdentityService,
    );
    // passport strategies
    this.add(createBindingFromClass(GoogleOauth, {key: 'googleStrategy'}));
    this.add(createBindingFromClass(CustomOauth2, {key: 'oauth2Strategy'}));
    // passport express middleware
    this.add(
      createBindingFromClass(GoogleOauth2ExpressMiddleware, {
        key: 'googleStrategyMiddleware',
      }),
    );
    this.add(
      createBindingFromClass(CustomOauth2ExpressMiddleware, {
        key: 'oauth2StrategyMiddleware',
      }),
    );
    // LoopBack 4 style authentication strategies
    this.add(createBindingFromClass(GoogleOauth2Authentication));
    this.add(createBindingFromClass(Oauth2AuthStrategy));
    this.add(createBindingFromClass(SessionStrategy));
    // Express style middleware interceptors
    this.bind('passport-init-mw').to(toInterceptor(passport.initialize()));
    this.bind('passport-session-mw').to(toInterceptor(passport.session()));
    this.bind('passport-google').toProvider(GoogleOauthInterceptor);
    this.bind('passport-oauth2').toProvider(CustomOauth2Interceptor);
    this.bind('set-session-user').toProvider(SessionAuth);
  }
}
