import React from 'react';
import NewsItem from './NewsItem';

function AltsNewsList(props) {
    return (
        <div className="news-container">
           {props.altsNews && props.altsNews.map((item, index) => <NewsItem key={index} url={item.url} text={item.text} image={item.image} title={item.title} source={item.source} />) }
        </div>
    )
}

export default AltsNewsList;