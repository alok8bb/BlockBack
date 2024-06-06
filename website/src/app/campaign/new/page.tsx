// This file is a lot of boilerplate, there was some component by
// Formik but didn't use that because couldn't set classes on them
// there might be some way of doing that but ignored that since won't be
// touching forms page much, for now a lot of repetition

"use client";

import Navbar from "@/components/navbar";
import { BlockBack_ABI } from "@/contract/abi";
import { SERVER_ENDPOINTS, contractAddress } from "@/lib/config";
import { CampaignMetadata, FundCategories } from "@/lib/types";
import { Formik, FormikErrors } from "formik";
import { ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useWriteContract } from "wagmi";
import { redirect } from "next/navigation";

type FormikValues = CampaignMetadata & {
  minAmount: number | string;
  maxAmount: number | string;
  goalAmount: number;
  deadline: string | number;
  cover?: File;
};

export default function NewCampaign() {
  const initialValues: FormikValues = {
    title: "",
    description: "",
    minAmount: "",
    maxAmount: "",
    goalAmount: 0,
    category: "Other",
    deadline: "",
  };

  const [coverURL, setCoverURL] = useState("");
  const [dataHash, setDataHash] = useState("");
  const { writeContract, isSuccess, isError, error } = useWriteContract();
  useEffect(() => {
    if (isSuccess) {
      toast.success("Campaign created successfully!");
    }

    if (isError) {
      toast.error("Oops, something went wrong, couldn't create transaction!");
      console.log(error);
    }
  }, [isSuccess, isError]);

  const onSubmit = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (setSubmitting: boolean) => void }
  ) => {
    const deadlineEpoch = new Date(values.deadline).getTime() / 1000;

    values = {
      ...values,
      deadline: deadlineEpoch,
      maxAmount:
        values.maxAmount === "" ? 10 : Number(values.maxAmount) * 10 ** 18,
      minAmount:
        values.minAmount === "" ? 0.0001 : Number(values.minAmount) * 10 ** 18,
      goalAmount: Number(values.goalAmount) * 10 ** 18,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(values as CampaignMetadata));
    formData.append("cover_image", values.cover!);

    try {
      const res = await fetch(SERVER_ENDPOINTS.uploadData, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const json: {
          hash: string;
        } = await res.json();
        console.log(json);
        setDataHash(json.hash);
        toast("Metadata saved successfully", {
          icon: "💾",
        });
      } else {
        throw new Error("server error!");
      }
    } catch (e) {
      console.error(e);
      toast.error("Oops, something went wrong, please try again later!");
      return;
    }

    toast("Initiating Transaction Window", {
      icon: "👛",
    });

    writeContract({
      abi: BlockBack_ABI,
      address: contractAddress as `0x${string}`,
      functionName: "createCampaign",
      args: [
        dataHash,
        BigInt(values.minAmount),
        BigInt(values.maxAmount),
        BigInt(values.goalAmount),
        BigInt(values.deadline),
      ],
    });

    setSubmitting(false);
  };

  return (
    <>
      <Navbar />
      <div className="flex w-full items-center justify-center my-10">
        <div className="lg:w-[40%] flex gap-3 flex-col">
          <h1 className="text-4xl font-bold tracking-wide">
            🚩 Create a new campaign
          </h1>
          <p className="text-gray-300 text-xl">
            Please fill out all the details carefully to create a new campaign.
          </p>
          <Formik
            initialValues={initialValues}
            validate={(values) => {
              const errors: FormikErrors<FormikValues> = {};

              if (!values.cover) {
                errors.cover = "Please select a cover image for the campaign";
              }

              if (!values.title) {
                errors.title = "Title is required";
              }

              if (!values.description) {
                errors.description = "Description is required";
              }

              if (!values.deadline) {
                errors.deadline = "Please specify valid deadline";
              }

              if (!values.goalAmount || values.goalAmount <= 0) {
                errors.goalAmount = "Total goal amount must be greater than 0";
              }

              try {
                const deadline = new Date(values.deadline);
                const today = new Date();
                deadline.setDate(deadline.getDate() + 1);

                if (today > deadline) {
                  errors.deadline =
                    "Please select a deadline that is at least 1 day from today.";
                }
              } catch (e) {
                errors.deadline = "Please specify a valid date";
              }

              return errors;
            }}
            onSubmit={onSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleSubmit,
              isSubmitting,
              handleChange,
              handleBlur,
              setFieldValue,
            }) => (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 w-full mt-4"
              >
                <InputLayout>
                  <label className={`${labelStyles}`} htmlFor="cover">
                    Cover Image
                  </label>
                  <img
                    className="w-full max-h-80 object-cover rounded-lg"
                    src={coverURL}
                    alt=""
                  />
                  <input
                    id="file"
                    name="cover"
                    className={`${inputStyles} p-2`}
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      if (event.currentTarget && event.currentTarget.files) {
                        setFieldValue("cover", event.currentTarget.files[0]);
                        var reader = new FileReader();
                        reader.onload = function (event) {
                          if (event.target) {
                            var imageUrl = event.target.result as string;
                            setCoverURL(imageUrl ?? imageUrl);
                          }
                        };

                        reader.readAsDataURL(event.currentTarget.files[0]);
                      }
                    }}
                  />
                  {errors.cover && <ErrorText>{errors.cover}</ErrorText>}
                </InputLayout>
                <InputLayout>
                  <label className={`${labelStyles}`} htmlFor="title">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${inputStyles}`}
                    placeholder="A suitable title"
                  />

                  {errors.title && touched.title && (
                    <ErrorText>{errors.title}</ErrorText>
                  )}
                </InputLayout>

                <InputLayout>
                  <label className={`${labelStyles}`} htmlFor="description">
                    Description
                  </label>
                  <textarea
                    rows={8}
                    className={`${inputStyles} outline-none`}
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={`Please describe your project: goals / impact / features`}
                  />

                  {errors.description && touched.description && (
                    <ErrorText>{errors.description}</ErrorText>
                  )}
                </InputLayout>

                <div className="flex sm:flex-row flex-col gap-4 items-start flex-wrap">
                  <InputLayout className="flex-1">
                    <label className={`${labelStyles}`} htmlFor="category">
                      Category
                    </label>
                    <select
                      className={`${inputStyles} outline-none`}
                      id="category"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.category}
                    >
                      {FundCategories.map((category) => {
                        return (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        );
                      })}
                    </select>

                    {errors.category && touched.category && (
                      <ErrorText>{errors.category}</ErrorText>
                    )}
                  </InputLayout>
                  <InputLayout className="flex-1">
                    <label className={`${labelStyles}`} htmlFor="deadline">
                      Deadline
                    </label>
                    <input
                      id="deadline"
                      name="deadline"
                      type="datetime-local"
                      className={`${inputStyles}`}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                    />
                    {errors.deadline && touched.deadline && (
                      <ErrorText>{errors.deadline}</ErrorText>
                    )}
                  </InputLayout>
                </div>

                <hr className="border-dotted" />
                <h3 className="text-gray-400 text-xl text-center font-bold mt-2">
                  Fund Details
                </h3>
                <div className="flex gap-5 flex-wrap">
                  <InputLayout className="flex-1">
                    <label className={`${labelStyles}`} htmlFor="minAmount">
                      Min Amount (optional)
                    </label>
                    <input
                      className={`${inputStyles}`}
                      id="minAmount"
                      name="minAmount"
                      type="number"
                      value={values.minAmount}
                      min={0}
                      step={"any"}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Min contribution (defualt: 0+ ETH)"
                    />
                  </InputLayout>
                  <InputLayout className="flex-1">
                    <label className={`${labelStyles}`} htmlFor="maxAmount">
                      Max Amount (optional)
                    </label>
                    <input
                      className={`${inputStyles}`}
                      id="maxAmount"
                      name="maxAmount"
                      type="number"
                      value={values.maxAmount}
                      min={0}
                      step={"any"}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Max contribution (defualt: 1 ETH)"
                    />
                  </InputLayout>
                  <InputLayout className="flex-1">
                    <label className={`${labelStyles}`} htmlFor="goalAmount">
                      🎯 Goal Amount
                    </label>
                    <input
                      className={`${inputStyles}`}
                      id="goalAmount"
                      name="goalAmount"
                      type="number"
                      value={values.goalAmount}
                      min={0}
                      step={"any"}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.goalAmount && touched.goalAmount && (
                      <ErrorText>{errors.goalAmount}</ErrorText>
                    )}
                  </InputLayout>
                </div>

                <hr className="border-dotted" />
                <InputLayout>
                  <label className={`${labelStyles}`} htmlFor="website">
                    Website
                  </label>
                  <input
                    type="text"
                    name="website"
                    value={values.website}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${inputStyles}`}
                    placeholder="Link to project website (optional)"
                  />

                  {errors.website && touched.website && (
                    <ErrorText>{errors.website}</ErrorText>
                  )}
                </InputLayout>

                <InputLayout>
                  <label className={`${labelStyles}`} htmlFor="twitter">
                    Twitter
                  </label>
                  <input
                    type="text"
                    name="twitter"
                    value={values.twitter}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${inputStyles}`}
                    placeholder="Twitter link (optional)"
                  />

                  {errors.twitter && touched.twitter && (
                    <ErrorText>{errors.twitter}</ErrorText>
                  )}
                </InputLayout>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 mt-4 bg-accent-500 text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400"
                >
                  Submit
                </button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}

export const inputStyles = `text-white p-4 px-4 rounded-md bg-magic-gray-2 placeholder-gray-500`;
const labelStyles = `text-gray-400`;

export const InputLayout: React.FC<{
  className?: string;
  children: ReactNode;
}> = ({ className, children }) => {
  return (
    <div className={`${className ?? ""} flex flex-col gap-2`}>{children}</div>
  );
};

const ErrorText: React.FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => {
  return (
    <span className={`${className && ""} text-red-500 text-md`}>
      {"* " + children}
    </span>
  );
};
