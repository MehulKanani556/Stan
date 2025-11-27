import React, { useEffect, useState, useRef } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { Box, Modal } from '@mui/material';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin6Fill, RiEdit2Fill } from "react-icons/ri";
import { allFaqs, createFaq, updateFaq, deleteFaq } from "../Redux/Slice/faq.slice";


const Faq = () => {

    const [openIndex, setOpenIndex] = useState(0);
    const [searchValue, setSearchValue] = useState('');
    const [createopen, setCreateopen] = useState(false);
    const [faqData, setFaqData] = useState("");
    const dispatch = useDispatch();
    const [delOpen, setDelOpen] = useState(false);
    const { faqs, loading, error } = useSelector(state => state.faq);


    const toggleIndex = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const validationSchema = Yup.object({
        faqQuestion: Yup.string().required("Faq Name is required"),
        faqAnswer: Yup.string().required("Description is required"),
    });

    const formik = useFormik({
        initialValues: {
            faqQuestion: "",
            faqAnswer: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            if (faqData) {
                // Update FAQ
                dispatch(updateFaq({ _id: faqData._id, ...values }));
            } else {
                // Create FAQ
                dispatch(createFaq(values));
            }
            handleCreateClose();
        },
    });


    const handleCreateClose = () => {
        setCreateopen(false);
        setFaqData("");
        formik.resetForm();
    };

    const handleOpen = (data) => {
        setCreateopen(true);
        setFaqData(data);
        if (data) {
            formik.setValues({
                faqQuestion: data.faqQuestion,
                faqAnswer: data.faqAnswer,
            });
        }
    };

    const handleDeleteOpen = (data) => {
        setDelOpen(true);
        setFaqData(data);
    };

    useEffect(() => {
        dispatch(allFaqs());
    }, [dispatch]);

    const handleDeleteClose = () => {
        setDelOpen(false);
    };
    const handleDeleteCategory = () => {
        dispatch(deleteFaq({ _id: faqData._id }));
        setDelOpen(false);
    };

    const filteredFaqs = Array.isArray(faqs)
        ? faqs.filter(faq =>
            faq.faqQuestion.toLowerCase().includes(searchValue.toLowerCase()) ||
            faq.faqAnswer.toLowerCase().includes(searchValue.toLowerCase())
        )
        : [];


    return (
        <div className="p-5 md:p-10">
            <div className="flex flex-col lg:flex-row gap-3 justify-between items-center">
                <div className="text-center lg:text-left">
                    <h1 className="text-2xl font-bold text-brown mb-2">Faq</h1>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4 w-full flex justify-content-between ">
                <div className="flex-1 mr-4">
                    <input
                        type="text"
                        placeholder="Search Faq..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="rounded w-full md:w-64 p-2 bg-white/10"
                    />
                </div>
                <div className="flex gap-4 ">
                    <button
                        className="bg-primary-light/15 w-20 sm:w-20 md600:w-32 text-white px-4 py-2 rounded "
                        onClick={() => setCreateopen(true)}
                    >
                        + Add
                    </button>
                </div>
            </div>

            <div className="">
                {loading && <div>Loading...</div>}
                {error && <div className="text-red-500">{error}</div>}
                {Array.isArray(filteredFaqs) && filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq, index) => (
                        <div
                            key={index}
                            className="p-[10px] md:p-4 rounded border-b-[1px] border-white/10 flex flex-col bg-white/5"
                        >
                            <button
                                onClick={() => toggleIndex(index)}
                                className="flex justify-between items-center w-full text-left"
                            >
                                <div className="flex items-center space-x-4">
                                    <span className="items-number text-[12px] sm:text-sm bg-white/10 p-3 text-white font-normal flex items-center justify-center rounded-[4px]">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <span className="text-[13px] sm:text-[16px] md:text-[17px] 3xl:text-[18px]">
                                        {faq.faqQuestion}
                                    </span>
                                </div>
                                {openIndex === index ? (
                                    <AiOutlineMinus className="text-white" />
                                ) : (
                                    <AiOutlinePlus className="text-white" />
                                )}
                            </button>

                            <div
                                className={`overflow-hidden transition-all flex justify-between duration-300 ease-in-out ${openIndex === index
                                    ? 'max-h-96 opacity-100 mt-[0px]'
                                    : 'max-h-0 opacity-0 mt-0'
                                    }`}
                            >
                                <div className="text-white/60  text-[12px] sm:text-[14px] md:text-[15px] 3xl:text-[16px] leading-relaxed pl-[53px] md:pl-[56px] pb-2">
                                    {faq.faqAnswer}
                                </div>

                                <div className="gap-4 flex">
                                    <button
                                        className="text-green-700 gap-3 text-xl p-1 border border-brown-50 rounded hover:bg-green-50 h-[30px] w-[30px]"
                                        onClick={() => handleOpen(faq)}
                                    >
                                        <RiEdit2Fill />
                                    </button>
                                    <button
                                        className="text-red-500 text-xl p-1 border border-brown-50 rounded hover:text-red-300 h-[30px] w-[30px]"
                                        onClick={() => handleDeleteOpen(faq)}
                                    >
                                        <RiDeleteBin6Fill />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-white/60 text-center py-8">No FAQs found.</div>
                )}

            </div>

            <Modal
                open={createopen}
                className="bg-white/10 backdrop:blur-sm"
                onClose={handleCreateClose}
            >
                <Box className="bg-primary-dark text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded max-w-[500px] w-[100%] max-h-[90vh] overflow-y-auto">
                    <form onSubmit={formik.handleSubmit} className="p-5">
                        <div className="text-center">
                            <p className="text-brown font-bold text-xl">
                                {faqData ? "Edit" : "Add"} FAQ
                            </p>
                        </div>

                        <div className="mt-6">
                            <label className=" font-bold">FAQ Name</label>
                            <input
                                type="text"
                                name="faqQuestion"
                                placeholder="Enter FAQ Name"
                                value={formik.values.faqQuestion}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="rounded w-full p-2 mt-1 bg-white/5"
                            />
                            {formik.touched.faqQuestion && formik.errors.faqQuestion && (
                                <p className="text-red-500 text-sm">
                                    {formik.errors.faqQuestion}
                                </p>
                            )}
                        </div>

                        <div className="mt-4">
                            <label className=" font-bold">FAQ Description</label>
                            <textarea
                                name="faqAnswer"
                                placeholder="Enter FAQ Description"
                                value={formik.values.faqAnswer}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                rows="3"
                                className="bg-white/5 rounded w-full p-2 mt-1 resize-none"
                            />
                            {formik.touched.faqAnswer &&
                                formik.errors.faqAnswer && (
                                    <p className="text-red-500 text-sm">
                                        {formik.errors.faqAnswer}
                                    </p>
                                )}
                        </div>

                        <div className="flex justify-center gap-8 mt-8">
                            <button
                                type="button"
                                onClick={handleCreateClose}
                                className="text-brown w-36 border-brown border px-5 py-2 rounded hover:bg-brown-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-brown text-white w-36 border-brown border px-5 py-2 rounded hover:bg-brown-50 disabled:opacity-50"
                            >
                                {loading ? "Processing..." : faqData ? "Update" : "Add"}
                            </button>
                        </div>
                    </form>
                </Box>
            </Modal>

            <Modal open={delOpen} onClose={handleDeleteClose}>
                <Box className="bg-primary-dark text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded max-w-[500px] w-[100%] max-h-[90vh] overflow-y-auto">
                    <div className="p-5">
                        <div className="text-center">
                            <p className="text-brown font-bold text-xl">Delete faq</p>
                            <p className="text-brown-50 mt-2">
                                Are you sure you want to delete "{faqData?.faqQuestion}"?
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-6 justify-center">
                            <button
                                onClick={handleDeleteClose}
                                className="text-brown w-32 border-brown border px-4 py-2 rounded hover:bg-brown-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteCategory}
                                disabled={loading}
                                className="bg-brown text-white w-32 border-brown border px-4 py-2 rounded hover:bg-brown-50 disabled:opacity-50"
                            >
                                {loading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default Faq;
