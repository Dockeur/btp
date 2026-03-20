import React from 'react';
import { Checkbox } from 'rizzui';

const FinancialDetailsForm = ({selectedImmeuble }) => {
  return (
    <form action="" className="">
    <h1 className="text-xl text-center font-poppins text-black m-3 font-semibold underline">
      Détails Financiers :
    </h1>

    <h2 className="text-Csecondary1 font-semibold">
      <Checkbox
        className="cursor-pointer text-Cprimary"
        label={
          <span className="">
            <span className="text-black font-semibold text-xl">
              Cout du terrain:{" "}
            </span>
            <span className="text-Cprimary text-lg">
              {new Intl.NumberFormat("fr", {
                style: "currency",
                currency: "XAF",
              }).format(
                selectedImmeuble.unit_price
              )}
            </span>
          </span>
        }
        inputClassName="checked:!bg-yellow-500 dark:border-slate-600 checked:!border-none ring-0 focus:ring-0 text-white"
      />
    </h2>

    <h2 className="text-Csecondary1 font-semibold">
      <Checkbox
        className="cursor-pointer text-Cprimary"
        label={
          <span className="">
            <span className="text-black font-semibold text-xl">
              Projets architecturaux :{" "}
            </span>
            <span className="text-Cprimary text-lg">
              {new Intl.NumberFormat("fr", {
                style: "currency",
                currency: "XAF",
              }).format(
                selectedImmeuble.unit_price
              )}
            </span>
          </span>
        }
        inputClassName="checked:!bg-yellow-500 dark:border-slate-600 checked:!border-none ring-0 focus:ring-0 text-white"
      />
    </h2>

    <h2 className="text-Csecondary1 font-semibold">
      <Checkbox
        className="cursor-pointer text-Cprimary"
        label={
          <span className="">
            <span className="text-black font-semibold text-xl">
              Communes et permis de batir :{" "}
            </span>
            <span className="text-Cprimary text-lg">
              {new Intl.NumberFormat("fr", {
                style: "currency",
                currency: "XAF",
              }).format(
                selectedImmeuble.total_price
              )}
            </span>
          </span>
        }
        inputClassName="checked:!bg-yellow-500 dark:border-slate-600 checked:!border-none ring-0 focus:ring-0 text-white"
      />
    </h2>
    <h2 className="text-Csecondary1 font-semibold">
      <Checkbox
        className="cursor-pointer text-Cprimary"
        label={
          <span className="">
            <span className="text-black font-semibold text-xl">
              Gros oeuvres :{" "}
            </span>
            <span className="text-Cprimary text-lg">
              {new Intl.NumberFormat("fr", {
                style: "currency",
                currency: "XAF",
              }).format(
                selectedImmeuble.unit_price
              )}
            </span>
          </span>
        }
        inputClassName="checked:!bg-yellow-500 dark:border-slate-600 checked:!border-none ring-0 focus:ring-0 text-white"
      />
    </h2>
    <h2 className="text-Csecondary1 font-semibold">
      <Checkbox
        className="cursor-pointer text-Cprimary"
        label={
          <span className="">
            <span className="text-black font-semibold text-xl">
              Finition :{" "}
            </span>
            <span className="text-Cprimary text-lg">
              {new Intl.NumberFormat("fr", {
                style: "currency",
                currency: "XAF",
              }).format(
                selectedImmeuble.unit_price
              )}
            </span>
          </span>
        }
        inputClassName="checked:!bg-yellow-500 dark:border-slate-600 checked:!border-none ring-0 focus:ring-0 text-white"
      />
    </h2>
    <h2 className="text-Csecondary1 font-semibold">
      <Checkbox
        className="cursor-pointer text-Cprimary"
        label={
          <span className="">
            <span className="text-black font-semibold text-xl">
              Projets architecturaux :{" "}
            </span>
            <span className="text-Cprimary text-lg">
              {new Intl.NumberFormat("fr", { 
                style: "currency",
                currency: "XAF",
              }).format(
                selectedImmeuble.unit_price
              )}
            </span>
          </span>
        }
        inputClassName="checked:!bg-yellow-500 dark:border-slate-600 checked:!border-none ring-0 focus:ring-0 text-white"
      />
    </h2>
    <h2 className=" text-Csecondary1 font-bold">
      Cout total de realisation hors terrain : {" "}
      <span className=" text-Cprimary text-lg">
        {new Intl.NumberFormat("fr", {
          style: "currency",
          currency: "XAF",
        }).format(selectedImmeuble.total_price)}
      </span>{" "}
    </h2>
  </form>
  );
};

export default FinancialDetailsForm;
