import React from 'react';
import HeroBanner from './HeroBanner';
import PlatformStats from './PlatformStats';
import FAQSection from './FAQSection';
import WhyChooseKnowloop from './WhyChooseKnowloop';
import SuccessStories from './SuccessStories';

const Home = () => {
    return (
        <div>
            <HeroBanner></HeroBanner>
            <PlatformStats></PlatformStats>
            <FAQSection></FAQSection>
            <WhyChooseKnowloop></WhyChooseKnowloop>
            <SuccessStories></SuccessStories>
        </div>
    );
};

export default Home;