import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import logo from "../../assets/logo.png";
import logoName from "../../assets/logoName.png";

const CollapsibleSidebar = ({ isCollapsed, toggleCollapse }) => {
  const navigation = [
    {
      name: "Document Library",
      path: "/dashboard/documents",
    },
    {
      name: "PO Workspace",
      path: "/dashboard/po-workspace",
    },
    {
      name: "Invoice Workspace",
      path: "/dashboard/invoice-workspace",
    },
    {
      name: "GRN Workspace",
      path: "/dashboard/grn-workspace",
    },
  ];

  return (
    <div
      className={`h-full bg-white border-r cursor-pointer border-gray-200 fixed top-0 left-0 bottom-0 flex flex-col transition-all duration-300 z-10 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div
        className={`${
          isCollapsed ? "justify-center p-4" : "p-6"
        } flex items-center`}
      >
        {isCollapsed ? (
          <img src={logo} alt="Logo" className="h-8" />
        ) : (
          <div className="flex items-center">
            <img src={logoName} alt="Logo Name" className="h-12 ml-2" />
          </div>
        )}
      </div>

      <button
        className="absolute top-4 right-0 transform translate-x-1/2 bg-white border border-gray-200 rounded-full p-1 shadow-md focus:outline-none"
        onClick={toggleCollapse}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 text-gray-500 transition-transform ${
            isCollapsed ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <nav className="mt-6 flex-1 px-2 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center ${
                isCollapsed ? "justify-center" : "px-4"
              } py-3 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? "bg-purple-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
            title={isCollapsed ? item.name : ""}
          >
            {!isCollapsed && item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

CollapsibleSidebar.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  toggleCollapse: PropTypes.func.isRequired,
};

export default CollapsibleSidebar;
