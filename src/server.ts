import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bluebird from 'bluebird';
import { Logger } from "@nestjs/common";
import { DefaultValidatorPipe } from './common/default-validator.pipe';
import { GlobalExceptionFilter } from './common/global-exception';
import { MainModule } from './main/main.module';
import setupOrmConfig from './ormconfig';
const newrelic = require('newrelic');
import * as express from 'express';
import * as bodyParser from 'body-parser';

setupOrmConfig();

function setupPromise() {
	global.Promise = <any>bluebird;
}

function setupGlobalFilters(app: NestExpressApplication) {
	app.useGlobalFilters(new GlobalExceptionFilter());
}

function setupPipes(app: NestExpressApplication) {
	app.useGlobalPipes(new DefaultValidatorPipe());
}

function setupCors(app: NestExpressApplication) {
	app.enableCors();
}

function setupNewRelic(app : NestExpressApplication){
	newrelic.instrumentLoadedModule(
		'express',    // the module's name, as a string
		app // the module instance
	);
	Logger.log('New Relic Connected',newrelic);
}

setupPromise();

function setup(app){
  setupGlobalFilters(app);
  setupPipes(app);
  setupCors(app);
  setupNewRelic(app);
}

async function bootstrap() {
  try {
	  	console.log({
			host : process.env.HOST,
			database : process.env.DB,
			password : process.env.PASSWORD,
			username : process.env.USER
		})
		const app = await NestFactory.create<NestExpressApplication>(MainModule, {
			logger : ['log','debug','error','verbose','warn'],
			abortOnError: false,
		});

		app.use(bodyParser.json({limit: '100mb'}));

    	setup(app);
		await app.listen(Number(process.env.PORT) || 3000);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
}
bootstrap();
