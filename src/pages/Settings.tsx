import { useSelector } from "react-redux";
import { object, string } from "yup";
import { RootState } from "../redux/store";
import { FastField, Form, Formik } from "formik";
import InputField from "../components/inputField";
import { GetUserInfoDto } from "../types/types";
import { callApi, updateUser } from "../api/axios";
import Swal from "sweetalert2";
import { useState } from "react";
import { uploadToCloudinary } from "../utils/helper";
import { notification } from "antd";

function Settings() {
  const [isLoading, setIsLoading] = useState(false);


  type UpdateUserInfoForm = Omit<GetUserInfoDto, "id">;

  const ProfileSchema = object({
    name: string().required("Name is required"),
    email: string().required("Email is required").email("The email is invalid"),
    phone: string().matches(
      /^(?:\+84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/,
      "The phone is invalid"
    ),
    address: string(),
    dob: string().matches(
      /^\d{4}-\d{2}-\d{2}$/,
      "Date of birth must be in YYYY-MM-DD format"
    ),
  });

  const user: GetUserInfoDto | null = useSelector(
    (state: RootState) => state.auth.currentUser
  );

  const [avatar, setAvatar] = useState<string | null>(user?.avatar || null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setIsLoading(true);

      try {
        const uploadedUrl = await uploadToCloudinary(file, "dnp8wwi3r", "images");
        setAvatar(uploadedUrl);
        notification.success({
          message: "Upload Success",
          description: "Image has been uploaded successfully.",
        });
      } catch (error) {
        notification.error({
          message: "Upload Failed",
          description: "Failed to upload image.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Formik<UpdateUserInfoForm>
      initialValues={{
        role: user?.role || [],
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
        dob: user?.dob
          ? `${user.dob[0]}-${String(user.dob[1]).padStart(2, "0")}-${String(user.dob[2]).padStart(2, "0")}`
          : "",
          avatar: user?.avatar || "",
      }}
      validationSchema={ProfileSchema}
      onSubmit={async (values) => {
        try {
          if (user) {
            const transformedValues: GetUserInfoDto = {
              ...values,
              avatar: avatar || user.avatar, // Use uploaded avatar or retain existing one
            };
            if (user.id) {
              await callApi(() => updateUser(user.id!, transformedValues));
              notification.success({
                message: "Update Success",
                description: "Profile has been updated successfully.",
              });
            }
          } else {
            console.error("User not found!");
          }
        } catch (error) {
          console.error("Failed to update profile:", error);
        }
      }}
    >
      {() => (
        <Form className="mb-40 mt-10 px-4 w-[80%] mx-auto">
          <h2 className="text-xl font-bold pb-2 border-b-2 mb-5">
            Manage Your Profile
          </h2>
          <div className="flex flex-col items-center mb-5">
            <label
              htmlFor="imageUpload"
              className="cursor-pointer flex items-center justify-center w-32 h-32 rounded-full bg-gray-200 overflow-hidden border border-gray-300"
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm text-gray-500">Upload Image</span>
              )}
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <li>
              <FastField
                name="name"
                placeholder="Enter your name"
                component={InputField}
                label="Name"
              />
            </li>
            <li>
              <FastField
                name="email"
                placeholder="Enter your email"
                component={InputField}
                label="Email"
              />
            </li>
            <li>
              <FastField
                name="phone"
                placeholder="Enter your phone number"
                component={InputField}
                label="Phone"
              />
            </li>
            <li>
              <FastField
                name="address"
                placeholder="Enter your address"
                component={InputField}
                label="Address"
              />
            </li>
            <li>
              <FastField
                name="dob"
                placeholder="Enter your date of birth (YYYY-MM-DD)"
                component={InputField}
                label="Date of Birth"
                type="date"
              />
            </li>
          </ul>
          <div className="flex justify-center mt-7">
            <button
              className={`${
                isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-primary hover:bg-primaryHover"
              } transition-all duration-300 text-white px-4 py-2 rounded-lg`}
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Update Profile"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default Settings;
