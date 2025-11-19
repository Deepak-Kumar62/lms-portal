import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import { filterOptions, sortOptions } from "@/config";
import { ArrowUpDownIcon, FilterIcon, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { fetchAllCoursesForStudent } from "@/services/stdentService";
import { useNavigate, useSearchParams } from "react-router-dom";

const ExploreCourses = () => {
    const [studentViewCoursesList, setStudentViewCoursesList] = useState([])

    const [filters, setFilters] = useState(
        JSON.parse(sessionStorage.getItem("filters")) || {}
    );

    const [searchParams, setSearchParams] = useSearchParams();

    const [sort, setSort] = useState("price-lowtohigh");
    const [loadingState, setLoadingState] = useState(false);

    const navigate = useNavigate()

    const handleFilterChange = (sectionId, currentOption) => {
        let filtersCopy = { ...filters }

        console.log("filters", filters)

        const indexOfCurrentSection = Object.keys(filtersCopy).indexOf(sectionId)

        if (indexOfCurrentSection === -1) {
            filtersCopy = {
                ...filtersCopy,
                [sectionId]: [currentOption.id]
            }
        } else {
            const indexOfCurrentOption = filtersCopy[sectionId].indexOf(currentOption.id)

            if (indexOfCurrentOption === -1) {
                filtersCopy[sectionId].push(currentOption.id)
            } else {
                filtersCopy[sectionId].splice(indexOfCurrentOption, 1)
            }
        }

        setFilters(filtersCopy)
        sessionStorage.setItem("filters", JSON.stringify(filtersCopy))
    }

    const fetchAllCourses = async () => {
        try {
            const query = new URLSearchParams();

            // Convert filters into proper query params
            Object.entries(filters).forEach(([key, values]) => {
                values.forEach(v => query.append(key, v));
            });

            if (sort) query.append("sortBy", sort);

            // console.log("Final Query:", query.toString());

            setLoadingState(true)

            const response = await fetchAllCoursesForStudent(query)

            if (response?.data?.success) {
                setStudentViewCoursesList(response?.data?.data)
                setLoadingState(false)
            }
        } catch (error) {
            setLoadingState(false)
            setStudentViewCoursesList([])
        }
    }

    const createSearchParams = () => {
        const queryParams = []

        for (const [key, value] of Object.entries(filters)) {
            if (Array.isArray(value) && value.length > 0) {
                const paramValue = value.join(",")
                queryParams.push(`${key}=${encodeURIComponent(paramValue)}`)
            }
        }

        return queryParams.join("&")
    }

    const handleCourseNavigate = (courseId) => {
        navigate(`/course/${courseId}`)
    }

    useEffect(() => {
        const buildQueryStringForFilters = createSearchParams(filters)
        setSearchParams(new URLSearchParams(buildQueryStringForFilters));
    }, [filters])

    useEffect(() => {
        if (sort !== null && filters !== null) {
            fetchAllCourses()
        }
    }, [sort, filters])

    useEffect(() => {
        return () => {
            sessionStorage.removeItem("filters")
        }
    }, [])


    return (
        <div className="container mx-auto px-4">
            {/* Header */}
            <div className="flex justify-between gap-2 items-center py-2">

                {/* MOBILE FILTER BUTTON */}
                <Sheet>
                    <SheetTrigger asChild className="lg:hidden">
                        <Button variant="outline" className="flex gap-2">
                            <FilterIcon size={18} />
                            Show Filters
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="left" className="w-72 overflow-y-auto">
                        <SheetHeader>
                            <SheetTitle className="text-xl font-bold flex items-center justify-between">
                                Filters
                            </SheetTitle>
                        </SheetHeader>

                        {/* MOBILE FILTER CONTENT */}
                        <div className="ml-3">
                            {Object.keys(filterOptions).map((keyItem) => (
                                <div key={keyItem} className="pb-4 border-b">
                                    <h3 className="font-bold mb-3">{keyItem.toUpperCase()}</h3>
                                    <div className="grid gap-2 mt-2">
                                        {filterOptions[keyItem].map((option) => (
                                            <Label
                                                key={option.id}
                                                className="flex font-medium items-center gap-3"
                                            >
                                                <Checkbox
                                                    checked={filters?.[keyItem]?.includes(option.id) ?? false}
                                                    onCheckedChange={() => handleFilterChange(keyItem, option)}
                                                />

                                                {option.label}
                                            </Label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>

                <div className="lg:hidden flex items-center gap-2">
                    {/* Sort Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-2 p-4">
                                <ArrowUpDownIcon className="h-4 w-4" />
                                <span className="text-[16px] font-medium">Sort By</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px]">
                            <DropdownMenuRadioGroup
                                value={sort}
                                onValueChange={(value) => setSort(value)}
                            >
                                {sortOptions.map((sortItem) => (
                                    <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}>
                                        {sortItem.label}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="outline" className="text-sm font-medium p-4">
                        {studentViewCoursesList.length} Results
                    </Button>
                </div>


            </div>

            <div className="relative flex flex-col md:flex-row gap-4">
                {/* DESKTOP FILTER SIDEBAR */}
                <aside className=" hidden lg:block w-64 space-y-4 border-r pr-4">
                    {Object.keys(filterOptions).map((keyItem) => (
                        <div key={keyItem} className="">
                            <h3 className="font-bold mb-3">{keyItem.toUpperCase()}</h3>
                            <div className="grid gap-2 mt-2">
                                {filterOptions[keyItem].map((option) => (
                                    <Label
                                        key={option.id}
                                        className="flex font-medium items-center gap-3"
                                    >
                                        <Checkbox
                                            checked={filters?.[keyItem]?.includes(option.id) ?? false}
                                            onCheckedChange={() => handleFilterChange(keyItem, option)}
                                        />
                                        {option.label}
                                    </Label>
                                ))}
                            </div>
                        </div>
                    ))}
                </aside>

                {/* MAIN CONTENT */}
                <main className="flex-1 overflow-y-auto">
                    <div className="flex justify-between ">
                        <h1 className="text-xl  lg:text-2xl font-bold">All Courses</h1>
                        <div className="hidden lg:flex items-center mb-4 gap-5">
                            {/* Sort Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="flex items-center gap-2 p-5">
                                        <ArrowUpDownIcon className="h-4 w-4" />
                                        <span className="text-[16px] font-medium">Sort By</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[180px]">
                                    <DropdownMenuRadioGroup
                                        value={sort}
                                        onValueChange={(value) => setSort(value)}
                                    >
                                        {sortOptions.map((sortItem) => (
                                            <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}>
                                                {sortItem.label}
                                            </DropdownMenuRadioItem>
                                        ))}
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button variant="outline" className="text-sm font-medium p-4">
                                {studentViewCoursesList.length} Results
                            </Button>
                        </div>
                    </div>

                    {/* COURSE LIST */}
                    <div className="space-y-4">
                        {studentViewCoursesList.length > 0 ? (
                            studentViewCoursesList.map((courseItem) => (
                                <Card
                                    onClick={
                                        () => handleCourseNavigate(courseItem?._id)
                                    }
                                    className="cursor-pointer"
                                    key={courseItem?._id}
                                >
                                    <CardContent className="flex gap-4 p-4">
                                        <div className="w-48 h-32 flex shrink-0">
                                            <img
                                                src={courseItem?.image}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-xl mb-2">
                                                {courseItem?.title}
                                            </CardTitle>
                                            <p className="text-sm text-gray-600 mb-1">
                                                Created By{" "}
                                                <span className="font-bold">
                                                    {courseItem?.instructorName}
                                                </span>
                                            </p>
                                            <p className="text-[16px] text-gray-600 mt-3 mb-2">
                                                {`${courseItem?.curriculum?.length} ${courseItem?.curriculum?.length <= 1
                                                    ? "Lecture"
                                                    : "Lectures"
                                                    } - ${courseItem?.level?.toUpperCase()} Level`}
                                            </p>
                                            <p className="font-bold text-lg">${courseItem?.pricing}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : loadingState ? (
                            <Skeleton />
                        ) : (
                            <h1 className="font-semibold text-xl">No Courses Found</h1>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ExploreCourses;