import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, User, Mail, Phone, DollarSign, Briefcase, Heart, Lock, Image as ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";

const MateAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "mate",
    fcmToken: "sdfsdfsdfsdfsd",
    categoryId: "69b93d8a84815abafa1b8262",
    pricePerHour: "",
    experience: "",
    specifications:[],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (!formData.email.trim() && !formData.mobile.trim()) {
      newErrors.email = "Email or Mobile is required";
    } else if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
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
        if (formData.email) data.append("email", formData.email);
        if (formData.mobile) data.append("mobile", formData.mobile);
        data.append("password", formData.password);
        data.append("role", "mate");
        if (formData.fcmToken) data.append("fcmToken", formData.fcmToken);
        if (formData.categoryId) data.append("categoryId", formData.categoryId);
        if (formData.pricePerHour) data.append("pricePerHour", formData.pricePerHour);
        if (formData.experience) data.append("experience", formData.experience);
        if (formData.specifications.length > 0) {
          formData.specifications.forEach((spec) => {
            data.append("specifications[]", spec);
          });
        }
        if (formData.image) {
          data.append("image", formData.image);
        }

        // POST /auth/register
        await axiosInstance.post("/auth/register", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        
        toast.success("Mate added successfully!");
        navigate("/mates");
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to add mate");
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

  

  const handleSpecificationChange = (spec) => {
    setFormData((prev) => {
      const specs = prev.specifications.includes(spec)
        ? prev.specifications.filter((s) => s !== spec)
        : [...prev.specifications, spec];
      return { ...prev, specifications: specs };
    });
  };

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
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg mr-4">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Add New Mate
              </h1>
              <p className="text-gray-500 text-sm">
                Fill in the details to create a new mate profile
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
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
                  className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter mate's full name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
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
                  onChange={handleChange}
                  className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter mate's email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Mobile */}
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
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter mobile number"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Category ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category ID
              </label>
              <input
                type="text"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter category ID"
              />
            </div>

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
                  className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
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
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter years of experience"
                  min="0"
                />
              </div>
            </div>

            {/* Specifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specifications
              </label>
              <div className="flex flex-wrap gap-2">
                {specificationOptions.map((spec) => (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => handleSpecificationChange(spec)}
                    className={`flex items-center px-4 py-2 rounded-lg border transition-all ${
                      formData.specifications.includes(spec)
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
                    }`}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            {/* FCM Token */}
            

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50"
              >
                <Save className="w-5 h-5 mr-2" />
                {isSubmitting ? "Saving..." : "Save Mate"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MateAdd;
