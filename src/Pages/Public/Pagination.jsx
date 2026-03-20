/// pas connecter a une page, peut etre enlever

import React from "react";
import ReactPaginate from "react-paginate";
import { motion } from "framer-motion";
import { BsChevronBarLeft, BsChevronBarRight } from "react-icons/bs";

const Pagination = () => {
  const paginationVariation = {
    hidden:{
      opacity:0,
      y:200,
    },
    visible:{
      opacity:1,
      y:0,
      transition:{
        type:"spring",
        stiffness :260,
        damping :20,
        duration:2,
      },
    },
  };
  return (
    < div   className="mt-16 px-5">
      <ReactPaginate
        breakLabel={<span className="mr-4">...</span>}
        nextLabel={
          <span className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-md ">
            <BsChevronBarRight />
          </span>
        }
       // onPageChange={1}
        pageRangeDisplayed={5}
        pageCount={50}
        previousLabel={<span className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-md mr-2">
        <BsChevronBarLeft />
      </span>
      }
        containerClassName="flex items-center justify-center mt-8 mb-6"
        pageClassName="block border- border-solid border-Cprimary hover:bg-Cprimary w-10 h-10 flex items-center justify-center rounded-md mr-2"
        activeClassName="bg-gray-400 text-white"
      />
    </div>
  );
};

export default Pagination;
