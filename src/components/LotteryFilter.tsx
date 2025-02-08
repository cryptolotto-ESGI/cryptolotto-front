export const LotteryFilter = ({
                                  onFilterChange
                              }: {
    onFilterChange: (active: boolean | undefined) => void
}) => {
    return (
        <div className="flex gap-4 mb-6">
            <button
                onClick={() => onFilterChange(undefined)}
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
            >
                All
            </button>
            <button
                onClick={() => onFilterChange(true)}
                className="px-4 py-2 rounded bg-blue-500 text-white"
            >
                Active
            </button>
            <button
                onClick={() => onFilterChange(false)}
                className="px-4 py-2 rounded bg-gray-500 text-white"
            >
                Ended
            </button>
        </div>
    );
};