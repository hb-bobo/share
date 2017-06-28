import * as React from 'react';
import { RouteWithSubRoutes } from '@/router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { upWorkPlanListData } from '@/store/actions';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import Drawer from 'material-ui/Drawer';
// import { WingBlank, Button, Icon } from 'antd-mobile';
import Scroller from '@/components/scroller';
import WorkPlan from './work-plan';
// import { POST } from '@/plugins/fetch';
import IconUp from '@/components/icon/up';
import SpaceRow from '@/components/space-row';
import HotUp from './hot-up';
@connect(
    // mapStateToProps
    (state) => ({workPlanData: state.issueAdvance.workPlanData}),
    // buildActionDispatcher
    (dispatch, ownProps) => ({
        actions: bindActionCreators({
            upWorkPlanListData
        }, dispatch)
    })
)
export class IssueAdvance extends React.Component {

  state = {
    title: this.props.advType + '问题推进页',
    isIndex: true,
    hotUpOpen: false,
    issueUPOpen: false,
    data: {}
  }

  componentWillMount () {
    var advType =  /\w+$/.exec(this.props.location.pathname)[0];
    this.setState({
      title: advType + '问题推进页',
      advType: advType
    });
  }

  componentDidMount () {
    /*POST('/getData',{
      data: JSON.stringify({
          "path": "workPlan.json"
      }),
      succee: (res) => {
        this.props.actions.upWorkPlanListData({
          action: 'update',
          value: res.result
        });
      }
    });*/
    this.props.actions.upWorkPlanListData({
       action: 'update',
       value: require('@/static/workPlan.json').result
    });
  }
  componentWillUpdate (nextProps, nextState) {
    
    // 当从edit页面返回 此页面的时候设置index为true, 并纠正title
    if (nextState.isIndex === true && this.state.isIndex !== true) {
      this.setState({
        title: this.state.advType + '问题推进页',
        isIndex: true,
      });
    }
    return true;
  }

  hotUp = () => {
    console.log(1)
    this.setState({
      hotUpOpen: true
    });
    return false
  }
  render() {
    var routes = [];
    if (this.props.routes) {
        routes = this.props.routes;
    }
    var advanceData = {
      id: 1111
    };
    return (
      <div className="issue-advance">
        {/*头部*/}
        <AppBar
            title={this.state.title}
            titleStyle={{textAlign: 'center'}}
            iconElementLeft={
                <IconButton onClick={() => {this.props.history.go(-1)}}>
                    <NavigationArrowBack color={'#FFF'}/>
                </IconButton>
            }
        />
        <Scroller autoSetHeight={true}>
          {/*顶部*/}
          <div className={this.state.isIndex ? "advance-top flex-row" : "advance-top flex-row hide"}>
            <div className="flex-col-6">
              <span>问题编号: </span>
              <span style={{marginLeft: '12px', color: '#6AC4F6'}}>{advanceData.id}</span>
            </div>
            <SpaceRow height={50} width="1px" backgroundColor="#EEEDED"/>
            <div className="flex-col-4">
              <span onClick={this.hotUp}>
                <IconUp value="热点" style={{marginLeft: '10px'}} > </IconUp>
              </span>
              <span>
                <IconUp value="问题" style={{marginLeft: '10px'}}> </IconUp>
              </span>
            </div>
          </div>

          {/*热点上升弹出*/}
          <Drawer 
              width="100%" 
              containerStyle={{top: '48px'}} 
              openSecondary={true} 
              open={this.state.hotUpOpen} 
          >
              <HotUp data={{}} parent={this}/>
          </Drawer>
          
          {/*问题上升弹出*/}
          <Drawer 
              width="100%" 
              containerStyle={{top: '48px'}} 
              openSecondary={true} 
              open={this.state.issueUPOpen} 
          >
              <HotUp data={{}} parent={this}/>
          </Drawer>

          {/*推进页不同的区域 route*/}
          {routes.map((route, i) => {
              route.parent = this;
              return(
                  <RouteWithSubRoutes key={i} {...route}/>
              )
          })}
          {/*工作计划*/}
          <div className="work-plan">
            <WorkPlan workPlanData={this.props.workPlanData} parent={this}/>
          </div>
        </Scroller>
      </div>
    );
  }
}
// const AdvanceWrap = createForm()(Advance);
export default IssueAdvance