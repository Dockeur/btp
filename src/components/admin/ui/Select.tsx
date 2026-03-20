import React from 'react'
import Select from 'react-select';

const CustomSelect = (props: any) => {
    return (
        <Select
            {...props}
            classNames={{
                control: () => "dark:!bg-transparent !ring-0 dark:!border-slate-600",
                valueContainer: () => "dark:!bg-transparent focus:!border-none dark:!border-slate-600",
                container: () => "dark:!bg-transparent",
                menuList: () => "p-2 dark:border dark:border-slate-600 dark:bg-neutral-900",
                menuPortal: () => "dark:bg-neutral-900 !z-[9999]",
                multiValue: () => "rounded-l dark:[&>div]:!text-white dark:!bg-neutral-800",
                option: () => "dark:!text-white dark:hover:!text-black",
            }}
            classNamePrefix={"react-select"}
            menuPortalTarget={document.body}
        />
    )
}

export default CustomSelect