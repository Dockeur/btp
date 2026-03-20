import { ProfileSchema, profileSchema } from "@/schema/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { RiCloseFill } from "react-icons/ri";
import { toast } from "react-toastify";
import { ActionIcon, Button, FileInput, Input, Modal, Text } from "rizzui";

const ProfileModal = ({
    modalState,
    setModalState,
    updateProfile,
    getAuth,
    getError,
}: any) => {
    const [loading, setLoading] = useState<boolean>(false);
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileSchema>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            last_name: getAuth().last_name,
            first_name: getAuth().first_name,
            email: getAuth().user.email,
            phone: getAuth().phone,
            position: getAuth().position,
        },
    });
    const onSubmit = async (data: ProfileSchema, e: any) => {
        try {
            setLoading(true);
            const formData = new FormData(e.target);
            if (data.profile[0]) {
                formData.append("profile", data.profile[0]);
            } else {
                formData.delete("profile");
            }
            // await updateProfile(formData);
            toast.promise(updateProfile(formData), {
                pending: "Chargement...",
                success: {
                    render() {
                        setModalState(false);
                        setLoading(false);
                        reset();
                        return "Profil mis à jour avec succès";
                    },
                },
                error: {
                    render() {
                        setLoading(false);
                        return getError();
                    },
                },
            });
        } catch (error: any) {
            console.log(error);
        }
    };
    return (
        <Modal isOpen={modalState} onClose={() => setModalState(false)}>
            <div className="flex flex-col gap-4 p-4 dark:bg-neutral-900 dark:text-white rounded-lg bg-white">
                <div className="flex items-center justify-between">
                    <Text className="text-2xl font-semibold">Modifier mon profil</Text>
                    <ActionIcon
                        size="sm"
                        variant="text"
                        onClick={() => setModalState(false)}
                    >
                        <RiCloseFill className="text-2xl" />
                    </ActionIcon>
                </div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid grid-cols-2 gap-4 py-4 &_label>span:border-none"
                >
                    <Input
                        error={errors.last_name?.message}
                        {...register("last_name")}
                        label="Nom"
                        inputClassName="ring-0 dark:border-slate-600"
                    />
                    <Input
                        error={errors.first_name?.message}
                        {...register("first_name")}
                        label="Prénom"
                        inputClassName="ring-0 dark:border-slate-600"
                    />
                    <Input
                        error={errors.email?.message}
                        {...register("email")}
                        label="Email"
                        className="col-span-2"
                        inputClassName="ring-0 dark:border-slate-600"
                    />
                    <Input
                        error={errors.position?.message}
                        {...register("position")}
                        label="Fonction"
                        className="col-span-2"
                        inputClassName="ring-0 dark:border-slate-600"
                    />
                    <Input
                        error={errors.phone?.message}
                        {...register("phone")}
                        label="Téléphone"
                        className="col-span-2"
                        inputClassName="ring-0 dark:border-slate-600"
                    />
                    <FileInput
                        error={errors.profile?.message as string}
                        label="Photo"
                        {...register("profile")}
                        className="col-span-2"
                        inputClassName="ring-0 dark:border-slate-600"
                    />
                    <Button
                        isLoading={loading}
                        type="submit"
                        className="bg-yellow-500 text-md font-semibold py-2 col-span-2 rounded-lg"
                    >
                        Valider
                    </Button>
                </form>
            </div>
        </Modal>
    );
};

export default ProfileModal;
