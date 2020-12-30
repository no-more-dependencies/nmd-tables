import JsonObjectDataMapper from "./datamappers/json-object";
import SimpleTsvDataMapper from "./datamappers/simple-tsv";
import NmdPagination from "./nmd-pagination";
import NmdTable from "./nmd-table";
import NmdTableData from "./nmd-table-data";
import NmdTdFilter from "./nmd-td-filter";
import NmdTh from "./nmd-th";

window.NmdTable = NmdTable;
window.NmdTh = NmdTh;
window.NmdTableData = NmdTableData;

NmdTableData.registerDataMapper(new JsonObjectDataMapper());
NmdTableData.registerDataMapper(new SimpleTsvDataMapper());

customElements.define(NmdTable.elementName, NmdTable, {extends: "table"});
customElements.define(NmdTh.elementName, NmdTh, {extends: "th"});
customElements.define(NmdTdFilter.elementName, NmdTdFilter, {extends: "td"});
customElements.define(NmdTableData.elementName, NmdTableData, {extends: "tbody"});
customElements.define(NmdPagination.elementName, NmdPagination);