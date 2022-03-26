import React, { useState } from "react";
import Pagination from "@material-ui/lab/Pagination";
const PaginationComponent = ({page,count,pageSize,pageSizes,handlePageChange,handlePageSizeChange}) => {
    
  return (
    <div className="mt-3 d-flex justify-content-between align-items-center">
      <div>
        <span>{"Items per Page: "}</span>
        <select onChange={handlePageSizeChange} value={pageSize}>
          {pageSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <Pagination
        className="my-3"
        count={count}
        page={page}
        siblingCount={1}
        boundaryCount={1}
        variant="outlined"
        shape="rounded"
        onChange={handlePageChange}
      />
    </div>
  );
}

export default PaginationComponent;
