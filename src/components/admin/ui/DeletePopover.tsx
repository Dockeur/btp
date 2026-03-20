import React from "react";
import { FiTrash2 } from "react-icons/fi";
import { ActionIcon, Button, Popover, Text, Title } from "rizzui";

export default function DeletePopover({ onDelete }: any) {
    return (
        <Popover placement="left" enableOverlay arrowClassName="dark:fill-neutral-900">
            <Popover.Trigger>
                <ActionIcon variant="outline" className="cursor-pointer dark:border-slate-600">
                    <FiTrash2 className="h-4 w-4" />
                </ActionIcon>
            </Popover.Trigger>
            <Popover.Content className="dark:bg-neutral-900 dark:border-none" >
                {({ setOpen }) => (
                    <div className="w-64 dark:bg-neutral-900 dark:text-white">
                        <Title as="h5">Supprimer cet élément</Title>
                        <Text className="w-full">Êtes-vous sûr de vouloir supprimer cet élément ?</Text>
                        <div className="flex justify-end gap-3 mb-1">
                            <Button className="dark:border-slate-600" size="sm" onClick={() => setOpen(false)} variant="outline">
                                Non
                            </Button>
                            <Button onClick={() => { setOpen(false); onDelete() }} size="sm">
                                Oui
                            </Button>
                        </div>
                    </div>
                )}
            </Popover.Content>
        </Popover >
    );
}
