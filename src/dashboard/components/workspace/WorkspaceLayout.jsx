import PropTypes from "prop-types";
import GlobalFilters from "./GlobalFilters";
import SummaryCard from "./SummaryCard";
import LocalFilters from "./LocalFilters";
import TotalsBar from "./TotalsBar";
import GlobalPagination from "../GlobalPagination";

const WorkspaceLayout = ({
  title,
  subtitle,
  globalFilters,
  onGlobalFilterChange,
  summaryGroups,
  localFilters,
  onLocalFilterChange,
  children,
  totals,
  pagination,
  onPageChange,
  isLoading,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalFilters filters={globalFilters} onChange={onGlobalFilterChange} />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>

        {summaryGroups.map((group, idx) => (
          <div key={idx} className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {group.title}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {group.cards.map((card) => (
                <SummaryCard
                  key={card.label}
                  label={card.label}
                  value={card.value}
                  color={card.color}
                  isActive={card.isActive}
                  onClick={card.onClick}
                />
              ))}
            </div>
          </div>
        ))}

        <LocalFilters filters={localFilters} onChange={onLocalFilterChange} />

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-gray-600">Loading...</span>
          </div>
        ) : (
          <>
            {children}
            {totals && <TotalsBar totals={totals} />}
            <GlobalPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={onPageChange}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

WorkspaceLayout.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  globalFilters: PropTypes.object.isRequired,
  onGlobalFilterChange: PropTypes.func.isRequired,
  summaryGroups: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      cards: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.number.isRequired,
          color: PropTypes.string,
          isActive: PropTypes.bool,
          onClick: PropTypes.func,
        })
      ).isRequired,
    })
  ).isRequired,
  localFilters: PropTypes.object.isRequired,
  onLocalFilterChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  totals: PropTypes.object,
  pagination: PropTypes.shape({
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    totalItems: PropTypes.number.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
  }).isRequired,
  onPageChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default WorkspaceLayout;
