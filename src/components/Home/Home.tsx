import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Home.scss";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ImageGrid from "../Items/ImageGrid";
import { Link } from "react-router-dom";
import UseFirestore from "../Firebase/UseFirestore";
import { LANDING_PAGE_ANIMATION } from "../../assets/landingPageImg";
import { PRICE_TAG } from "../../assets/priceTag";
import Tooltip from "@material-ui/core/Tooltip";
import { fireGetDocs } from "../../config/fire";

const Home = () => {
	// const { docs } = UseFirestore("images");
	const [docs, setDocs] = useState<any[]>();

	useEffect(() => {
		fireGetDocs("images").then((snap) => {
			let documents = [];
			snap.forEach((doc) => {
				documents.push({ ...doc.data(), id: doc.id });
			});
			setDocs(documents);
		});
	}, []);

	const responsive = {
		superLargeDesktop: {
			breakpoint: { max: 4000, min: 3000 },
			items: 5,
		},
		desktop: {
			breakpoint: { max: 3000, min: 1024 },
			items: 3,
		},
		tablet: {
			breakpoint: { max: 1024, min: 464 },
			items: 2,
		},
		mobile: {
			breakpoint: { max: 464, min: 0 },
			items: 1,
		},
	};

	return (
		<>
			<div className="home_container">
				<div className="home_message">
					<motion.h1
						initial={{ x: "-100vw" }}
						animate={{ x: 0 }}
						transition={{ duration: 1.7, type: "spring" }}
					>
						Bring{" "}
					</motion.h1>
					<motion.h1
						initial={{ x: "-100vw" }}
						animate={{ x: 0 }}
						transition={{ duration: 2.3, type: "spring" }}
					>
						Happiness
					</motion.h1>
					<motion.h1
						initial={{ x: "-100vw" }}
						animate={{ x: 0 }}
						transition={{ duration: 2.9, type: "spring" }}
					>
						To your kids
					</motion.h1>
					<motion.h1
						initial={{ x: "-100vw" }}
						animate={{ x: 0 }}
						transition={{ duration: 2.9, type: "spring" }}
					>
						<li className="get-started">
							<Link to="/item">Get Started</Link>
						</li>
					</motion.h1>
				</div>
				<div className="play_with_toy">{LANDING_PAGE_ANIMATION}</div>
			</div>
			<div className="item_preview">
				{docs && (
					<Carousel
						responsive={responsive}
						slidesToSlide={1}
						infinite={true}
						autoPlay={true}
						autoPlaySpeed={1500}
						arrows={false}
					>
						{docs.map((doc, index) => (
							<div key={doc.id} className="slide_img">
								<Link to={`/itemDetail/${doc.id}`}>
									<div className="imgBox">
										<img
											src={doc.url}
											alt={doc.url}
											width="200px"
											height="150px"
										/>
									</div>
								</Link>
								<div
									id={`slideProductDesc_${index}`}
									className="desc"
								>
									<Tooltip
										title={doc.imageName}
										placement="top-start"
									>
										<span>{doc.imageName}</span>
									</Tooltip>
								</div>
								<div className="price">
									{PRICE_TAG()} ${doc.price}
								</div>
							</div>
						))}
					</Carousel>
				)}
			</div>
			<ImageGrid />
		</>
	);
};

export default Home;
