"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { AsyncDatabase } = require("promised-sqlite3");
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield AsyncDatabase.open("../DataExtractor/parliament.db");
        const query = "SELECT * FROM ParliamentGroups";
        const result = yield db.all(query);
        let parliamentGroups = [];
        result.forEach((row) => {
            parliamentGroups.push({
                acronym: row.acronym,
                name: row.name
            });
        });
        console.log(parliamentGroups);
        return parliamentGroups;
    });
}
exports.default = connect;
