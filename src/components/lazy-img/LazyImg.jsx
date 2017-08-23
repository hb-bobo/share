import * as React from 'react';
import PropTypes from 'prop-types';
import loadingImg from '@/static/images/home_top.jpg';
/**
 * 加载图片
 * @param {Element}  需要懒加载的img对象
 * @param {string} - img url
 * @return {void}
 */
const loadImg = function (obj, url) {
    var oImg = new Image();
    oImg.src = url;
    oImg.onload = function () {
        obj.src = url;
        oImg = null;
    }
}

export default class LazyImg extends React.Component {
    static propTypes = {
        url: PropTypes.string,
        alt: PropTypes.string,
        style: PropTypes.object
    }
    state = {
        isLoad: false
    }
    componentDidMount () {
        if (this.props.url !== '' && this.state.isLoad === false) {
            loadImg(this.img, this.props.url);
            this.setState({
                isLoad: true
            });
        }
    }
    // 外层url参数写死的，有时候不会调此方式，所以加了个componentDidMount，异步的一定会调
    componentWillReceiveProps (nextProps) {
        if (nextProps.url !== '' && this.state.isLoad === false) {
            loadImg(this.img, nextProps.url);
            this.setState({
                isLoad: true
            });
        }
    }

    render () {
        var {alt, style} = this.props;
        return (
            <img style={style} ref={ref => this.img = ref} src={loadingImg} alt={alt}/>
        )
    }
}