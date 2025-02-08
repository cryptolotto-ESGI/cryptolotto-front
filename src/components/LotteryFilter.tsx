import {Input} from "@/components/ui/input";

interface LotteryFilterProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    activeFilter: boolean | undefined;
    onFilterChange: (active: boolean | undefined) => void;
}

export function LotteryFilter({
                                  searchQuery,
                                  onSearchChange,
                                  activeFilter,
                                  onFilterChange
                              }: LotteryFilterProps) {
    return (
        <div className="space-y-6 mb-8">
            <div className="w-full">
                <Input
                    type="text"
                    placeholder="Search lotteries..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full"
                />
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => onFilterChange(undefined)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                        activeFilter === undefined
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                >
                    All
                </button>
                <button
                    onClick={() => onFilterChange(true)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                        activeFilter === true
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                >
                    Active
                </button>
                <button
                    onClick={() => onFilterChange(false)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                        activeFilter === false
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                >
                    Ended
                </button>
            </div>
        </div>
    );
}