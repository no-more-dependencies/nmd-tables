//@ts-check

import RestSource from "./data-sources/rest-source";
import NmdCol from "./nmd-col";
import NmdTable from "./nmd-table";
import NmdTableData from "./nmd-table-data";
import NmdTdFilter from "./nmd-td-filter";
import NmdTh from "./nmd-th";
import NmdBasicPaginator from "./paginators/basic-paginator";

Object.assign(window, {
	NmdTable, RestSource,

	NmdRestSource: RestSource,
});

customElements.define(NmdTable.elementName, NmdTable);
customElements.define(NmdCol.elementName, NmdCol);

customElements.define(NmdBasicPaginator.elementName, NmdBasicPaginator);

customElements.define(NmdTh.elementName, NmdTh, {extends: "th"});
customElements.define(NmdTdFilter.elementName, NmdTdFilter, {extends: "td"});
customElements.define(NmdTableData.elementName, NmdTableData, {extends: "tbody"});