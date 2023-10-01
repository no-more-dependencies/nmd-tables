//@ts-check

import NmdCol from "./nmd-col";
import NmdTable from "./nmd-table";
import NmdTableData from "./nmd-table-data";
import NmdTdFilter from "./nmd-td-filter";
import NmdTh from "./nmd-th";
import NmdBasicPaginator from "./paginators/nmd-basic-paginator";
import NmdTableRenderer from "./renderers/nmd-table-renderer";
import { registerCustomElements } from "./utils/dom";

registerCustomElements({
	NmdTable, NmdCol,
	NmdTableRenderer,
	NmdBasicPaginator,

	NmdTh, NmdTdFilter, NmdTableData
});
