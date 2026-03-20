import { Contract, downloadContract, listContracts } from "@/services/ContractsService";
import { createSaleRequest, SaleRequestType } from "@/services/Salerequestservice";

import React, { useCallback, useEffect, useRef, useState } from "react";


const IconHome = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);
const IconLand = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
);
const IconClose = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const IconUpload = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);
const IconKml = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const IconCheck = () => (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);
const IconPdf = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v6h6" />
    </svg>
);
const IconExternalLink = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);
const IconDownload = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);
const IconShield = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);


interface SaleRequestModalProps {
    onClose: () => void;
}

interface FormState {
    type: SaleRequestType | "";
    description: string;
    area: string;
    numberOfRoom: string;
    numberOfToilet: string;
    is_fragmentable: boolean;
    relief: string;
    land_title: string;
    certificat_of_ownership: boolean;
    technical_doc: boolean;
    country: string;
    city: string;
    street: string;
    kml_file: File | null;
    photos: File[];
    has_validated_contrat: boolean;
}

const RELIEF_OPTIONS = [
    { value: "",       label: "Sélectionner…" },
    { value: "flat",   label: "Plat"           },
    { value: "slope",  label: "En pente"       },
    { value: "hilly",  label: "Vallonné"       },
    { value: "rocky",  label: "Rocheux"        },
];


const Field = ({
    label, value, onChange, type = "text", placeholder, min, step, required,
}: {
    label: string; value: string; onChange: (v: string) => void;
    type?: string; placeholder?: string; min?: string; step?: string; required?: boolean;
}) => (
    <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder} min={min} step={step}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm
                text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2
                focus:ring-Cprimary/30 focus:border-Cprimary transition-all duration-200" />
    </div>
);

const SelectField = ({
    label, value, onChange, options,
}: {
    label: string; value: string; onChange: (v: string) => void;
    options: { value: string; label: string }[];
}) => (
    <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            {label}
        </label>
        <select value={value} onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm
                text-gray-800 focus:outline-none focus:ring-2 focus:ring-Cprimary/30
                focus:border-Cprimary transition-all duration-200 appearance-none cursor-pointer">
            {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
    </div>
);

const Toggle = ({
    label, sublabel, checked, onChange,
}: {
    label: string; sublabel?: string; checked: boolean; onChange: (v: boolean) => void;
}) => (
    <div className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex-1 min-w-0 pr-3">
            <p className="text-sm font-medium text-gray-700 leading-tight">{label}</p>
            {sublabel && <p className="text-xs text-gray-400 mt-0.5">{sublabel}</p>}
        </div>
        <button type="button" onClick={() => onChange(!checked)}
            className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent
                transition-colors duration-200 focus:outline-none ${checked ? "bg-Cprimary" : "bg-gray-300"}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200
                ${checked ? "translate-x-4" : "translate-x-0"}`} />
        </button>
    </div>
);


const ContractStep = ({
    accepted,
    onAcceptChange,
}: {
    accepted: boolean;
    onAcceptChange: (v: boolean) => void;
}) => {
    const [contract, setContract]       = useState<Contract | null>(null);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState<string | null>(null);
    const [downloading, setDownloading] = useState(false);
    const [pdfOpen, setPdfOpen]         = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const res = await listContracts();
                const all = res.data ?? [];
 
                const saleContracts = all.filter((c) => c.type === "request_for_sales");

               
                setContract(saleContracts.length > 0 ? saleContracts[saleContracts.length - 1] : null);
            } catch {
                setError("Impossible de charger le contrat.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleDownload = async () => {
        if (!contract) return;
        setDownloading(true);
        try {
            const blob = await downloadContract(contract.id);
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement("a");
            a.href     = url;
            a.download = `${contract.title}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            alert("Erreur lors du téléchargement.");
        } finally {
            setDownloading(false);
        }
    };

    
    if (loading) return (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 border-2 border-Cprimary/30 border-t-Cprimary rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Chargement du contrat…</p>
        </div>
    );

   
    if (error || !contract) return (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 text-sm font-medium">Aucun contrat de vente disponible.</p>
            <p className="text-gray-400 text-xs">Contactez l'administrateur si ce problème persiste.</p>
            <div
                onClick={() => onAcceptChange(!accepted)}
                className={`mt-4 flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all w-full
                    ${accepted ? "border-Cprimary bg-Cprimary/5" : "border-gray-200 hover:border-Cprimary/50"}`}
            >
                <div className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all
                    ${accepted ? "bg-Cprimary border-Cprimary" : "border-gray-300"}`}>
                    {accepted && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
                <span className="text-sm text-gray-600">
                    Je reconnais avoir pris connaissance des conditions générales et les accepte.
                </span>
            </div>
        </div>
    );

 
    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-500">
                Veuillez lire attentivement le contrat avant de soumettre votre demande.
                <span className="text-red-400 font-medium"> L'acceptation est obligatoire.</span>
            </p>

          
            <div className="border border-gray-200 rounded-xl overflow-hidden">
                {/* header */}
                <div className="bg-gray-50 px-4 py-3 flex items-center gap-3 border-b border-gray-200">
                    <div className="text-red-500 flex-shrink-0"><IconPdf /></div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-700 truncate">{contract.title}</p>
                        <p className="text-xs text-gray-400">
                            Publié le {new Date(contract.created_at).toLocaleDateString("fr-FR", {
                                day: "2-digit", month: "long", year: "numeric",
                            })}
                        </p>
                    </div>
                 
                    <span className="flex-shrink-0 text-[10px] font-bold bg-Cprimary/10 text-Cprimary px-2 py-0.5 rounded-full">
                        Vente
                    </span>
                </div>

               
                {pdfOpen && (
                    <div className="relative w-full bg-gray-900" style={{ height: "380px" }}>
                        <iframe
                            src={`${contract.file_url}#toolbar=0&navpanes=0`}
                            className="w-full h-full"
                            title={contract.title}
                        />
                        <button
                            onClick={() => setPdfOpen(false)}
                            className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full
                                w-7 h-7 flex items-center justify-center transition-all text-xs"
                        >
                            ✕
                        </button>
                    </div>
                )}

          
                <div className="px-4 py-3 flex items-center gap-2 flex-wrap">
                    <button
                        onClick={() => setPdfOpen(!pdfOpen)}
                        className="flex items-center gap-2 text-sm font-semibold text-Cprimary
                            hover:bg-Cprimary/10 px-3 py-1.5 rounded-lg transition-all border border-Cprimary/20"
                    >
                        <IconExternalLink />
                        {pdfOpen ? "Fermer" : "Lire le contrat"}
                    </button>
                    <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="flex items-center gap-2 text-sm font-semibold text-gray-600
                            hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-all border border-gray-200 disabled:opacity-60"
                    >
                        {downloading
                            ? <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            : <IconDownload />}
                        Télécharger
                    </button>
                </div>
            </div>

        
            <div
                onClick={() => onAcceptChange(!accepted)}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${accepted
                        ? "border-Cprimary bg-Cprimary/5"
                        : "border-gray-200 hover:border-Cprimary/50 hover:bg-gray-50"}`}
            >
                <div className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all
                    ${accepted ? "bg-Cprimary border-Cprimary" : "border-gray-300"}`}>
                    {accepted && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
                <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700">J'ai lu et j'accepte le contrat</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        En cochant cette case, vous confirmez avoir lu et accepté les termes et conditions du contrat de vente.
                    </p>
                </div>
                <div className={`flex-shrink-0 ${accepted ? "text-Cprimary" : "text-gray-300"}`}>
                    <IconShield />
                </div>
            </div>

            {!accepted && (
                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
                    Vous devez accepter le contrat pour pouvoir soumettre votre demande.
                </p>
            )}
        </div>
    );
};


const SaleRequestModal: React.FC<SaleRequestModalProps> = ({ onClose }) => {
    const [step, setStep]       = useState<1 | 2 | 3 | 4 | 5>(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError]     = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const kmlInputRef  = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState<FormState>({
        type: "",
        description: "",
        area: "",
        numberOfRoom: "",
        numberOfToilet: "",
        is_fragmentable: false,
        relief: "",
        land_title: "",
        certificat_of_ownership: false,
        technical_doc: false,
        country: "",
        city: "",
        street: "",
        kml_file: null,
        photos: [],
        has_validated_contrat: false,
    });

    const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handlePhotoFiles = useCallback((files: FileList | null) => {
        if (!files) return;
        const newFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
        setForm((prev) => ({ ...prev, photos: [...prev.photos, ...newFiles].slice(0, 10) }));
    }, []);

    const removePhoto = (index: number) =>
        setForm((prev) => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));

    const onDropPhotos = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        handlePhotoFiles(e.dataTransfer.files);
    }, [handlePhotoFiles]);

    const handleKmlFile = (files: FileList | null) => {
        if (!files || !files[0]) return;
        setField("kml_file", files[0]);
    };

    const canProceed = () => {
        if (step === 1) return form.type !== "";
        if (step === 2) return form.description.trim().length >= 10;
        if (step === 5) return form.has_validated_contrat;
        return true;
    };

    const handleSubmit = async () => {
        if (!form.type || !form.has_validated_contrat) return;
        setLoading(true);
        setError(null);
        try {
            await createSaleRequest({
                description: form.description,
                type: form.type as SaleRequestType,
                has_validated_contrat: true,
                ...(form.type === "property"
                    ? {
                        property_data: {
                            ...(form.area           ? { area:           parseFloat(form.area) }          : {}),
                            ...(form.numberOfRoom   ? { numberOfRoom:   parseInt(form.numberOfRoom) }    : {}),
                            ...(form.numberOfToilet ? { numberOfToilet: parseInt(form.numberOfToilet) }  : {}),
                        },
                    }
                    : {
                        land_data: {
                            ...(form.area       ? { area: parseFloat(form.area) } : {}),
                            is_fragmentable:         form.is_fragmentable,
                            certificat_of_ownership: form.certificat_of_ownership,
                            technical_doc:           form.technical_doc,
                            ...(form.relief     ? { relief:     form.relief }     : {}),
                            ...(form.land_title ? { land_title: form.land_title } : {}),
                        },
                    }),
                address: { country: form.country, city: form.city, street: form.street },
                kml_file: form.kml_file,
                photos: form.photos,
            } as any);
            setSuccess(true);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    const steps = ["Type", "Détails", "Localisation", "Photos", "Contrat"];

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden
                    animate-[slideUp_0.3s_ease-out] flex flex-col max-h-[92vh]">

                  
                    <div className="bg-Cprimary px-6 py-5 flex-shrink-0">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-white font-bold text-lg font-poppins">Demande de vente</h2>
                                <p className="text-white/70 text-xs mt-0.5">Renseignez les informations de votre bien</p>
                            </div>
                            <button onClick={onClose}
                                className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1.5 transition-all">
                                <IconClose />
                            </button>
                        </div>
                        {!success && (
                            <div className="flex items-center">
                                {steps.map((label, i) => {
                                    const num = (i + 1) as 1 | 2 | 3 | 4 | 5;
                                    const active = step === num;
                                    const done   = step > num;
                                    return (
                                        <React.Fragment key={label}>
                                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all
                                                    ${done   ? "bg-white text-Cprimary"
                                                    : active ? "bg-white text-Cprimary ring-2 ring-white/50"
                                                             : "bg-white/20 text-white"}`}>
                                                    {done ? "✓" : num}
                                                </div>
                                                <span className={`text-xs font-medium hidden sm:block ${active ? "text-white" : "text-white/60"}`}>
                                                    {label}
                                                </span>
                                            </div>
                                            {i < steps.length - 1 && (
                                                <div className={`flex-1 h-px mx-1 ${done ? "bg-white" : "bg-white/30"}`} />
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                   
                    <div className="p-6 overflow-y-auto flex-1">

                       
                        {success && (
                            <div className="flex flex-col items-center py-6 text-center">
                                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
                                    <IconCheck />
                                </div>
                                <h3 className="text-xl font-bold text-Csecondary1 font-poppins mb-2">Demande envoyée !</h3>
                                <p className="text-gray-500 text-sm max-w-xs">
                                    Votre demande de vente a été soumise avec succès. Notre équipe vous contactera dans les meilleurs délais.
                                </p>
                                <button onClick={onClose}
                                    className="mt-6 bg-Cprimary text-white font-semibold px-8 py-2.5 rounded-lg hover:bg-Csecondary1 transition-colors">
                                    Fermer
                                </button>
                            </div>
                        )}

                      
                        {!success && step === 1 && (
                            <div>
                                <p className="text-sm text-gray-500 mb-5">Quel type de bien souhaitez-vous mettre en vente ?</p>
                                <div className="grid grid-cols-2 gap-4">
                                    {([
                                        { value: "property", label: "Propriété", sub: "Maison, appartement, villa…", Icon: IconHome },
                                        { value: "land",     label: "Terrain",   sub: "Parcelle, lot, terrain nu…", Icon: IconLand },
                                    ] as const).map(({ value, label, sub, Icon }) => (
                                        <button key={value} onClick={() => setField("type", value)}
                                            className={`relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-200
                                                ${form.type === value ? "border-Cprimary bg-Cprimary/5 shadow-md" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
                                            {form.type === value && (
                                                <span className="absolute top-2 right-2 w-5 h-5 bg-Cprimary rounded-full flex items-center justify-center text-white text-xs">✓</span>
                                            )}
                                            <div className={form.type === value ? "text-Cprimary" : "text-gray-400"}><Icon /></div>
                                            <div className="text-center">
                                                <p className={`font-bold text-sm ${form.type === value ? "text-Cprimary" : "text-gray-700"}`}>{label}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        
                        {!success && step === 2 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                        Description <span className="text-red-400">*</span>
                                    </label>
                                    <textarea value={form.description} onChange={(e) => setField("description", e.target.value)}
                                        placeholder="Décrivez votre bien : localisation, état, atouts particuliers…" rows={3}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm
                                            text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2
                                            focus:ring-Cprimary/30 focus:border-Cprimary transition-all resize-none" />
                                    <p className={`text-xs mt-1 text-right ${form.description.length < 10 ? "text-red-400" : "text-gray-400"}`}>
                                        {form.description.length} / 10 min.
                                    </p>
                                </div>
                                <Field label="Superficie (m²)" required value={form.area}
                                    onChange={(v) => setField("area", v)} type="number" min="0" step="0.01" placeholder="Ex : 120" />
                                {form.type === "property" && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <Field label="Nbre de chambres" value={form.numberOfRoom}
                                            onChange={(v) => setField("numberOfRoom", v)} type="number" min="0" placeholder="Ex : 4" />
                                        <Field label="Nbre de toilettes" value={form.numberOfToilet}
                                            onChange={(v) => setField("numberOfToilet", v)} type="number" min="0" placeholder="Ex : 2" />
                                    </div>
                                )}
                                {form.type === "land" && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <SelectField label="Type de relief" value={form.relief}
                                                onChange={(v) => setField("relief", v)} options={RELIEF_OPTIONS} />
                                            <Field label="N° titre foncier" value={form.land_title}
                                                onChange={(v) => setField("land_title", v)} placeholder="Ex : TF-12345" />
                                        </div>
                                        <div className="space-y-2">
                                            <Toggle label="Terrain fragmentable" sublabel="Le terrain peut-il être divisé en lots ?"
                                                checked={form.is_fragmentable} onChange={(v) => setField("is_fragmentable", v)} />
                                            <Toggle label="Certificat de propriété" sublabel="Document de propriété disponible"
                                                checked={form.certificat_of_ownership} onChange={(v) => setField("certificat_of_ownership", v)} />
                                            <Toggle label="Documentation technique" sublabel="Plans, relevés topographiques disponibles"
                                                checked={form.technical_doc} onChange={(v) => setField("technical_doc", v)} />
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                       
                        {!success && step === 3 && (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-500">Indiquez l'adresse du bien <span className="text-gray-400">(optionnel)</span></p>
                                <Field label="Pays"         value={form.country} onChange={(v) => setField("country", v)} placeholder="Ex : Cameroun" />
                                <Field label="Ville"        value={form.city}    onChange={(v) => setField("city", v)}    placeholder="Ex : Douala" />
                                <Field label="Rue / Quartier" value={form.street} onChange={(v) => setField("street", v)} placeholder="Ex : Bonanjo" />
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                        Fichier KML <span className="text-gray-400 normal-case font-normal">(localisation précise)</span>
                                    </label>
                                    {form.kml_file ? (
                                        <div className="flex items-center gap-3 px-4 py-3 bg-Cprimary/5 border border-Cprimary/30 rounded-lg">
                                            <div className="text-Cprimary flex-shrink-0"><IconKml /></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-700 truncate">{form.kml_file.name}</p>
                                                <p className="text-xs text-gray-400">{(form.kml_file.size / 1024).toFixed(1)} Ko</p>
                                            </div>
                                            <button onClick={() => setField("kml_file", null)}
                                                className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                                                <IconClose />
                                            </button>
                                        </div>
                                    ) : (
                                        <button onClick={() => kmlInputRef.current?.click()}
                                            className="w-full flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300
                                                rounded-lg text-sm text-gray-500 hover:border-Cprimary hover:text-Cprimary hover:bg-Cprimary/5 transition-all">
                                            <IconKml /><span>Choisir un fichier .kml ou .kmz</span>
                                        </button>
                                    )}
                                    <input ref={kmlInputRef} type="file" accept=".kml,.kmz" className="hidden"
                                        onChange={(e) => handleKmlFile(e.target.files)} />
                                </div>
                            </div>
                        )}

                       
                        {!success && step === 4 && (
                            <div>
                                <p className="text-sm text-gray-500 mb-4">
                                    Ajoutez jusqu'à <strong>10 photos</strong> de votre bien{" "}
                                    <span className="text-gray-400">(5 Mo max / photo, optionnel)</span>
                                </p>
                                <div onDrop={onDropPhotos} onDragOver={(e) => e.preventDefault()}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center
                                        cursor-pointer hover:border-Cprimary hover:bg-Cprimary/5 transition-all">
                                    <div className="text-gray-300 flex justify-center mb-2"><IconUpload /></div>
                                    <p className="text-sm font-medium text-gray-600">Glissez vos photos ici</p>
                                    <p className="text-xs text-gray-400 mt-1">ou cliquez pour sélectionner</p>
                                    <p className="text-xs text-gray-300 mt-1">{form.photos.length}/10 photos</p>
                                    <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                                        onChange={(e) => handlePhotoFiles(e.target.files)} />
                                </div>
                                {form.photos.length > 0 && (
                                    <div className="grid grid-cols-4 gap-2 mt-4">
                                        {form.photos.map((file, i) => (
                                            <div key={i} className="relative group aspect-square">
                                                <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover rounded-lg" />
                                                <button onClick={() => removePhoto(i)}
                                                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5
                                                        flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                  
                        {!success && step === 5 && (
                            <ContractStep
                                accepted={form.has_validated_contrat}
                                onAcceptChange={(v) => setField("has_validated_contrat", v)}
                            />
                        )}

                        {error && step === 5 && (
                            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}
                    </div>

               
                    {!success && (
                        <div className="px-6 pb-6 pt-2 flex items-center justify-between gap-3 border-t border-gray-100 flex-shrink-0">
                            <button
                                onClick={() => step > 1 ? setStep((s) => (s - 1) as any) : onClose()}
                                className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
                                {step === 1 ? "Annuler" : "Retour"}
                            </button>
                            {step < 5 ? (
                                <button onClick={() => setStep((s) => (s + 1) as any)} disabled={!canProceed()}
                                    className="flex-1 bg-Cprimary disabled:bg-gray-200 disabled:text-gray-400
                                        text-white font-semibold py-2.5 rounded-lg text-sm
                                        hover:bg-Csecondary1 transition-colors disabled:cursor-not-allowed">
                                    {step === 4 ? "Suivant — Contrat" : "Suivant"}
                                </button>
                            ) : (
                                <button onClick={handleSubmit} disabled={loading || !form.has_validated_contrat}
                                    className="flex-1 bg-Cprimary disabled:bg-gray-200 disabled:text-gray-400
                                        text-white font-semibold py-2.5 rounded-lg text-sm
                                        hover:bg-Csecondary1 transition-colors flex items-center justify-center gap-2
                                        disabled:cursor-not-allowed">
                                    {loading ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                            Envoi en cours…
                                        </>
                                    ) : "Envoyer la demande"}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </>
    );
};

export default SaleRequestModal;