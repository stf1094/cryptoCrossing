import React from 'react';
import NewsItem from './NewsItem';

function BtcNewsList(props) {
    return (
        <div className="news-container">
           {props.btcNews && props.btcNews.map((item, index) => <NewsItem key={index} url={item.url} text={item.text} image={item.image} title={item.title} source={item.source} />) }
        </div>
    )
}

export default BtcNewsList;