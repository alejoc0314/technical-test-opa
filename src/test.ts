// Este archivo es requerido por Karma antes de que se ejecuten las pruebas.
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// Inicializa el entorno de pruebas de Angular
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Carga automáticamente todos los archivos de prueba (archivos con extensión .spec.ts)
const context = require.context('./', true, /\.spec\.ts$/);
context.keys().forEach(context);
