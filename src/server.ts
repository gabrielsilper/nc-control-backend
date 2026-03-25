import App from './app';

const APP_PORT = process.env.APP_PORT || 3000;

const app = new App();
app.start(APP_PORT);
