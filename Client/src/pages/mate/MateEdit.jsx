import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, User, Mail, Phone, DollarSign, Briefcase, Heart, Image as ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import { useGetQuery } from "../../api/apiCall";
import Loader from "../../components/UI/Loader";

const MateEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    fcmToken: "",
    categoryId: "",
    pricePerHour: "",
    experience: "",
    specifications: [],
    image: null,
    imagePreview: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch existing mate data
  const { data: mateData, isLoading: isFetching } = useGetQuery(
    `/users/get/${id}`,
    ["mate", id]
  );

  // Populate form with existing data
  useEffect(() => {
    if (mateData?.data) {
      const mate = mateData.data;
      setFormData({
        name: mate.name || "",
        email: mate.email || "",
        mobile: mate.mobile ? String(mate.mobile) : "",
        fcmToken: mate.fcmToken || "",
        categoryId: mate.mate?.categoryId || mate.categoryId || "",
        pricePerHour: mate.mate?.pricePerHour || mate.pricePerHour || "",
        experience: mate.mate?.experience || mate.experience || "",
        specifications: mate.mate?.specifications || mate.specifications || [],
        image: null,
        imagePreview: mate.image || "",
      });
    }
  }, [mateData]);

  const specificationOptions = [
    "Love",
    "Relationship",
    "Career",
    "Finance",
    "Health",
    "Education",
    "Business",
    "Personal Growth"
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.pricePerHour.trim()) {
      newErrors.pricePerHour = "Price per hour is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Create FormData
        const data = new FormData();
        
        data.append("name", formData.name);
        if (formData.fcmToken) data.append("fcmToken", formData.fcmToken);
        if (formData.categoryId) data.append("categoryId", formData.categoryId);
        if (formData.pricePerHour) data.append("pricePerHour", formData.pricePerHour);
        if (formData.experience) data.append("experience", formData.experience);
        if (formData.specifications.length > 0) {
          data.append("specifications", formData.specifications);
        }
        if (formData.image) {
          data.append("image", formData.image);
        }

        // PUT /users/update?userId={id}
        await axiosInstance.put(`/users/update?userId=${id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        
        toast.success("Mate updated successfully!");
        navigate("/mates");
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to update mate");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSpecificationChange = (spec) => {
    setFormData((prev) => {
      const specs = prev.specifications.includes(spec)
        ? prev.specifications.filter((s) => s !== spec)
        : [...prev.specifications, spec];
      return { ...prev, specifications: specs };
    });
  };

  if (isFetching) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/mates")}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Mates List
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg mr-4">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                Edit Mate
              </h1>
              <p className="text-gray-500 text-sm">
                Update the mate details
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center overflow-hidden">
                  {formData.imagePreview ? (
                    <img
                      src={formData.imagePreview}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>
                <label
                  htmlFor="image-upload"
                  className="absolute bottom-0 right-0 bg-green-500 text-white p-1.5 rounded-full cursor-pointer hover:bg-green-600"
                >
                  <ImageIcon className="w-4 h-4" />
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-2">Click to upload profile image</p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter mate's full name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email (Read only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                  disabled
                />
              </div>
            </div>

            {/* Mobile (Read only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                  disabled
                />
              </div>
            </div>

            {/* Category ID */}
            
            {/* Price Per Hour */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Per Hour (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="pricePerHour"
                  value={formData.pricePerHour}
                  onChange={handleChange}
                  className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
                    errors.pricePerHour ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter price per hour"
                  min="0"
                />
              </div>
              {errors.pricePerHour && (
                <p className="mt-1 text-sm text-red-500">{errors.pricePerHour}</p>
              )}
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience (Years)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter years of experience"
                  min="0"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 focus:ring-4 focus:ring-green-200 transition-all disabled:opacity-50"
              >
                <Save className="w-5 h-5 mr-2" />
                {isSubmitting ? "Updating..." : "Update Mate"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MateEdit;
