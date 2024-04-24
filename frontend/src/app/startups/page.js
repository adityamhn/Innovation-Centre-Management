import React from "react";
import styles from "@/styles/pages/Startups.module.scss";
import { Row } from "antd";
import StartupCard from "@/components/common/startups/StartupCard";
import { getPublicStartups } from "@/services/user.services";

const startups = [
  {
    id: "1",
    name: "BugBase",
    description: "BugBase is a continuous vulnerability assessment platform.",
    logo_url: "https://bugbase.ai/assets/images/logos/straightLogo.svg",
    website_url: "https://bugbase.ai",
    industry: ["Cybersecurity"],
  },
  {
    id: "2",
    name: "Instrumus",
    description:
      "Helps in booking on scientific and research oriented resources offered by universities, colleges and private organizations",
    logo_url:
      "https://conference.manipal.edu/ICRAIS2023/img/instrumus%20logo.jpeg",
    website_url: "https://www.instrumus.com/",
    industry: ["Saas"],
  },
  {
    id: "3",
    name: "Fundinc",
    description:
      "Fundinc is a SaaS solution to enable VCs and Angel Networks to make the most of their deal-flow management processes",
    logo_url:
      "https://images.crunchbase.com/image/upload/c_pad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/mkzlkiv06eftnwzmthjl",
    website_url: "https://www.fundinc.in/",
    industry: ["Saas", "Venture Capital"],
  },
  {
    id: "4",
    name: "Flying Electronics",
    description: "One-stop shop for all your FPV racing drone needs",
    logo_url:
      "https://flyingelectronics.com/wp-content/uploads/2022/04/fe_logo1-1-e1650228463329.png",
    website_url: "https://flyingelectronics.com/",
    industry: ["Electronics"],
  },
  {
    id: "5",
    name: "Baylink",
    description:
      "Baylink harnesses the power of Al to integrate your brand into the offline market.",
    logo_url:
      "https://www.baylink.in/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo_blue.91277244.png&w=256&q=75",
    website_url: "https://www.baylink.in/",
    industry: ["D2C", "Retail"],
  },
  {
    id: "6",
    name: "Formi",
    description:
      "Transforming Complex Data into Simple, Actionable Steps for restaurants",
    logo_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpJzXv3Ii4GoHa2oxQ0JIHBkyf7ZD9rnotgFivYzHvZgiVHp9VE6-Ob2Y3&s=10",
    industry: ["FoodTech"],
    website_url: "https://www.formi.co.in/",
  },
];

const Startups = async () => {
  // const {startups} = await getPublicStartups();

  return (
    <div className={styles.startupsContainer}>
      <div className={styles.startups}>
        <h2 className={styles.startupsTitle}>
          Ongoing projects at Innovation Centre
        </h2>
        <Row className={styles.list}>
          {startups.map((startup) => (
            <StartupCard startup={startup} key={startup.id} />
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Startups;
