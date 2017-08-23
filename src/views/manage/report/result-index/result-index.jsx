import * as React from 'react';
import EchartLine from '@/components/echarts/echart-line';
import { Accordion } from 'antd-mobile';
import { POST } from '@/plugins/fetch';
import SilkScroller from '@/components/silk-scroller';
import dateFormat from '@/utils/format/dateFormat';
import {currMounth, handleLineData, arrToArr} from '../handleChartData';
import PanenlHeadContent from '../PanenlHeadContent';
import TouchZoom from '@/components/zoom/touch-zoom';

/* 质量月报->结果指标 */
class ResultIndex extends React.Component {
    state = {
        time: dateFormat(new Date(), 'yyyy-MM'),
        PRTS60_DATA: [],
        PRTS95_DATA: [],
        EIR_DATA: [],
        AftersalesIssue60_DATA: [],
        AftersalesIssue95_DATA: [],
        QualitySpill_DATA: [],
        IPTV12_DATA: [],
        IPTV24_DATA: [],
        CPV12_DATA: [],
        CPV24_DATA: [],
    }

    componentDidMount () {
        // stateKey 是state上用来setState用的，其他字段是传到后台的
        /* PRTS 和 Aftersales issue */
        var PRTS_params = [
            {
                kpiName: 'PRTS60',
                stateKey: 'PRTS60_DATA',
                uploadType: 'PRTS60',
                type: 'PRTS60',
                codeType: null
            },
            {
                kpiName: 'PRTS95',
                stateKey: 'PRTS95_DATA',
                uploadType: 'PRTS95',
                type: 'PRTS95',
                codeType: null
            },
            {
                kpiName: 'AI60',
                stateKey: 'AftersalesIssue60_DATA',
                uploadType: 'AS60',
                type: 'AS60',
                codeType: null
            },
            {
                kpiName: 'AI95',
                stateKey: 'AftersalesIssue95_DATA',
                uploadType: 'AS95',
                type: 'AS95',
                codeType: null
            }, 
        ];
        
        /* 递归取目标值 */
        var getChartData = (index) => {
            POST('/monthReport/mGetMonthReport', {
                data: {
                    kpiName: PRTS_params[index].kpiName,
                    kpiYear: this.state.time,
                    uploadType: PRTS_params[index].uploadType,
                    type:  PRTS_params[index].type,
                    codeType: PRTS_params[index].codeType
                }
            }).then((res) => {
                if (res.success === true) {
                    var actualValue = res.resultPrtsAndAi;;
                    this.setState({
                        [PRTS_params[index].stateKey]: handleLineData(res.data, actualValue)
                    });
                }
                // 存在就继续
                if (PRTS_params[index + 1] !== undefined) {
                    getChartData(++index);
                }
            }).catch((error) => {
                // 错了还得继续 && 存在就继续
                if (PRTS_params[index + 1] !== undefined) {
                    getChartData(++index);
                }
            });
        }
        getChartData(0);

        /*EIR */
        var EIR_param = {
            kpiName: 'EIR',
            kpiYear: this.state.time,
            uploadType: 'EIR',
            type: 'EIR',
            codeType: null
        };
        POST('/monthReport/mGetMonthReport', {
            data: EIR_param
        }).then((res) => {
            if (res.success === true) {
                var actualValue = JSON.parse(res.Eirresult).COUNT;
                this.setState({
                    EIR_DATA: handleLineData(res.data, arrToArr(actualValue), true)
                });
            }

        }).catch((error) => {

        });

        /* Quality spill */
        var SPILL_param = {
            kpiName: 'SPILL',
            kpiYear: this.state.time,
            uploadType: null,
            type: null,
            codeType: null
        };
        POST('/monthReport/mGetMonthReport', {
            data: SPILL_param
        }).then((res) => {
            if (res.success === true) {
                var actualValue = JSON.parse(res.qualitySpillResult).COUNT;
                var value = 0;
                // 累加处理
                actualValue = actualValue.map(function (item) {
                    value += item;
                    return value
                });
                // 数据不够长，得补全到当月 - 1
                var len = (currMounth + 1) - actualValue.length;
                if (len > 0) {
                    for(let i = 0; i < len; i++) {
                        actualValue.push(value);
                    }
                }
                this.setState({
                    'QualitySpill_DATA': handleLineData(res.data, arrToArr(actualValue), true)
                });
            }

        }).catch((error) => {

        });
        /* CPV IPTV */
        var CPV_and_IPTV_param =[
             {
                kpiName: 'CPV12',
                stateKey: 'CPV12_DATA',
                uploadType: '12MIS',
                type: null,
                codeType: 'CPV'
            },
            {
                kpiName: 'CPV24',
                stateKey: 'CPV24_DATA',
                uploadType: '24MIS',
                type: null,
                codeType: 'CPV'
            },
            {
                kpiName: 'IPTV12',
                stateKey: 'IPTV12_DATA',
                uploadType: '12MIS',
                type: null,
                codeType: 'IPTV'
            },
            {
                kpiName: 'IPTV24',
                stateKey: 'IPTV24_DATA',
                uploadType: '24MIS',
                type: null,
                codeType: 'IPTV'
            }
        ];

        /* 递归取目标值 */
        var getChartData2 = (index) => {
            POST('/monthReport/mGetMonthReport', {
                data: {
                    kpiName: CPV_and_IPTV_param[index].kpiName,
                    kpiYear: this.state.time,
                    uploadType: CPV_and_IPTV_param[index].uploadType,
                    type:  CPV_and_IPTV_param[index].type,
                    codeType: CPV_and_IPTV_param[index].codeType
                }
            }).then((res) => {
                if (res.success === true) {
                    var actualValue = JSON.parse(res.CPVAndIPTVResult).COUNT;
                    this.setState({
                        [CPV_and_IPTV_param[index].stateKey]: handleLineData(res.data, arrToArr(actualValue), true)
                    });
                }
                // 存在就继续
                if (CPV_and_IPTV_param[index + 1] !== undefined) {
                    getChartData2(++index);
                }
            }).catch((error) => {
                // 错了还得继续 && 存在就继续
                if (CPV_and_IPTV_param[index + 1] !== undefined) {
                    getChartData2(++index);
                }
            });
        }
        getChartData2(0);
    }
    /**
     * 重置容器高度
     */
    restScroller = () => {
        setTimeout(() => this.refs.scorller.refresh(), 500)
    }
    render () {
        var state = this.state;
        return (
            <SilkScroller
                preventDefault={false}
                useToTop={false}
                eventPassthrough={true}
                ref="scorller"
            >
                <Accordion
                    defaultActiveKey="0"
                    className="chart-list"
                    onChange={this.restScroller}
                >
                    <Accordion.Panel header="PRTS(60%)">
                        <TouchZoom>
                            <EchartLine
                                series={state.PRTS60_DATA}
                            />
                        </TouchZoom>
                    </Accordion.Panel>
                    <Accordion.Panel header="PRTS(95%)" className="chart-item">
                        <EchartLine
                            series={state.PRTS95_DATA}
                        />
                    </Accordion.Panel>
                    <Accordion.Panel header={<PanenlHeadContent leftContent="EIR" rightContent="单位:天"/>} className="chart-item">
                        <EchartLine
                            yFormat="{value}"
                            series={state.EIR_DATA}
                        />
                    </Accordion.Panel>
                    <Accordion.Panel header="Aftersales issue(60%)" className="chart-item">
                        <EchartLine
                            series={state.AftersalesIssue60_DATA}
                        />
                    </Accordion.Panel>
                    <Accordion.Panel header="Aftersales issue(95%)" className="chart-item">
                        <EchartLine
                            series={state.AftersalesIssue95_DATA}
                        />
                    </Accordion.Panel>
                    <Accordion.Panel header={<PanenlHeadContent leftContent="Quality spill" rightContent="单位:个"/>} className="chart-item">
                        <EchartLine
                            yFormat="{value}"
                            series={state.QualitySpill_DATA}
                        />
                    </Accordion.Panel>
                    <Accordion.Panel header={<PanenlHeadContent leftContent="IPTV(12 MIS)" rightContent="单位:PPT"/>} className="chart-item">
                        <EchartLine
                            yFormat="{value}"
                            series={state.IPTV12_DATA}
                        />
                    </Accordion.Panel>
                    <Accordion.Panel header={<PanenlHeadContent leftContent="CPV(12 MIS)" rightContent="单位:元"/>} className="chart-item">
                        <EchartLine
                            yFormat="{value}"
                            series={state.CPV12_DATA}
                        />
                    </Accordion.Panel>
                    <Accordion.Panel header={<PanenlHeadContent leftContent="IPTV(24 MIS)" rightContent="单位:PPT"/>} className="chart-item">
                        <EchartLine
                            yFormat="{value}"
                            series={state.IPTV24_DATA}
                        />
                    </Accordion.Panel>
                    <Accordion.Panel header={<PanenlHeadContent leftContent="CPV(24 MIS)" rightContent="单位:元"/>} className="chart-item">
                        <EchartLine
                            yFormat="{value}"
                            series={state.CPV24_DATA}
                        />
                    </Accordion.Panel>
                </Accordion>
            </SilkScroller>
        )
    }
    
}

export default ResultIndex;

