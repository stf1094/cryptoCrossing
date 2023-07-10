import React from 'react';
import NewsItem from './NewsItem';

function NewsList(props) {
    return (
        <div className="news-container">
           {props.news && props.news.map((item, index) => <NewsItem key={index} url={item.url} text={item.text} image={item.image} title={item.title} source={item.source} />) }
        </div>
    )
}

export default NewsList;
