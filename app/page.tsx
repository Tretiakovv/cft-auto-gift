"use client";

import { Block } from "../components/Block/Block";
import { EmployeesCalendar } from "../components/EmployeesCalendar/EmployeesCalendar";
import { GenerateBlock } from "../components/GenerateBlock/GenerateBlock";
import { Hero } from "../components/Hero/Hero";
import styles from "./page.module.css";

const Home = () => (
    <main className={`min-h-screen py-[100px] w-full justify-center flex ${styles.shimmeringBackground}`}>
        <div className="w-full flex flex-col gap-[60px] items-center">
            <Block className="flex flex-row gap-[100px]">
                <Hero />
                <GenerateBlock />
            </Block>
            <EmployeesCalendar />
        </div>
    </main>
);

export default Home;
