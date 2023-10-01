//@ts-check

import RestSource from "../js/data-sources/rest-source.js";
import Backend from "../js/helpers/backend.js";

globalThis.source = new RestSource("data.json");
globalThis.backend = new Backend(source);
backend.fetchData();