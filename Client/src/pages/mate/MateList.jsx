import React from "react";
import { Link } from "react-router-dom";
import { useGetQuery } from "../../api/apiCall";
import API_ENDPOINTS from "../../api/apiEndpoint";
import { Plus, User, Mail, Phone, DollarSign, Briefcase, Heart, Image } from "lucide-react";
import Loader from "../../components/UI/Loader";

const MateList = () => {
  const { data, isLoading, error } = useGetQuery(
    `/users/getAll?page=1&limit=100&role=mate`,
    ["mates"]
  );

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Failed to load mates: {error?.message}
        </div>
      </div>
    );
  }

  // API response structure: { success, message, data: { total, totalPages, page, limit, data: [...] } }
  const mates = data?.data?.data || [];
  const totalMates = data?.data?.total || 0;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mates</h1>
          <p className="text-gray-500">Total {totalMates} mates found</p>
        </div>
        <Link
          to="/mate/add"
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Mate
        </Link>
      </div>

      {mates.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700">No mates found</h3>
          <p className="text-gray-500">Click "Add Mate" to create your first mate</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
               
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price/Hour
                  </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
             
               
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mates.map((mate) => (
                  <tr key={mate._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {mate.image || mate.category?.image ? (
                            <img
                              className="h-12 w-12 rounded-full object-cover"
                              src={mate.image || mate.category?.image}
                              alt={mate.name}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                              <span className="text-white font-medium text-lg">
                                {mate.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium capitalize text-gray-900">
                            {mate.name}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {mate.role}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {mate.email && (
                          <div className="flex items-center text-gray-500 mb-1">
                            <Mail className="w-3 h-3 mr-2" />
                            {mate.email}
                          </div>
                        )}
                        {mate.mobile && (
                          <div className="flex items-center text-gray-500">
                            <Phone className="w-3 h-3 mr-2" />
                            {mate.mobile}
                          </div>
                        )}
                      </div>
                    </td>
                  
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm font-medium text-green-600">
                       <p className="text-green-600 font-bold">
  {mate.mate?.currency === "INR" ? "" : "₹"} {mate.mate?.price}
</p>
                        {mate.mate?.pricePerMin || "-"}
                      </div>
                    </td>
                    
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            mate.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {mate.isActive ? "Active" : "Inactive"}
                        </span>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            mate.isOnBoardingCompleted
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {mate.isOnBoardingCompleted ? "Onboarded" : "Pending"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/mate/edit/${mate._id}`}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MateList;
