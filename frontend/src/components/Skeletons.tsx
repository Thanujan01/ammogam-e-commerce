export const Skeleton = ({ className }: { className?: string }) => {
    return (
        <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
    );
};

export const HeroSkeleton = () => {
    return (
        <div className="w-full mb-6 sm:mb-8 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl h-64 sm:h-80 md:h-96 bg-gray-200 animate-pulse relative">
            <div className="absolute inset-0 flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 h-full bg-gray-300"></div>
                <div className="hidden md:block w-1/2 h-full bg-gray-200"></div>
            </div>
        </div>
    );
};

export const CategorySkeleton = () => {
    return (
        <div className="mb-10">
            <div className="flex justify-between items-center mb-4 md:mb-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <div className="flex space-x-2 md:space-x-4 overflow-hidden pb-4 md:pb-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-1/5 min-w-[80px] md:min-w-[160px]">
                        <div className="flex flex-col items-center justify-center p-3 md:p-5 rounded-lg md:rounded-xl h-full w-full bg-white border border-gray-100">
                            <Skeleton className="w-10 h-10 md:w-16 md:h-16 rounded-full mb-2 md:mb-4" />
                            <Skeleton className="h-3 md:h-4 w-16" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const ProductGridSkeleton = () => {
    return (
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 mb-8 sm:mb-12">
            {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden h-[300px] flex flex-col">
                    <Skeleton className="w-full h-48" />
                    <div className="p-3 flex-1 flex flex-col gap-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <div className="mt-auto flex justify-between items-center">
                            <Skeleton className="h-5 w-20" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const HomeSkeleton = () => {
    return (
        <>
            <div className="md:hidden mb-6">
                <Skeleton className="w-full h-64 rounded-xl" />
            </div>
            <div className="hidden md:block">
                <CategorySkeleton />
            </div>
            <div className="hidden md:block">
                <HeroSkeleton />
            </div>
            <div className="md:hidden">
                <CategorySkeleton />
            </div>

            <div className="flex justify-between items-center mb-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-5 w-20" />
            </div>
            <ProductGridSkeleton />
        </>
    );
};
