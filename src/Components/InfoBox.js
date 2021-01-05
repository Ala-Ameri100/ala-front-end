import React, { Component } from 'react';
import styled from 'styled-components';
import { Card } from 'react-bootstrap';
import { Doughnut, Polar } from 'react-chartjs-2';


const MainDiv = styled.div`
    display: flex;
    height: calc(100vh - 58px);
    overflow-y: auto;
    justify-content: center;
`;

const CardDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80%;
`;

const doughnutData = {
    labels: [
        'MERN',
        'LAMP',
        'MEAN'
    ],
    datasets: [{
        data: [300, 50, 100],
        backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
        ],
        hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
        ]
    }]
};

const bubbleData = {
    datasets: [
        {
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [
                { x: 65, y: 75, r: 10 },
                { x: 59, y: 49, r: 100 },
                { x: 80, y: 90, r: 50 },
                { x: 81, y: 29, r: 20 },
                { x: 56, y: 36, r: 100 },
                { x: 55, y: 25, r: 20 },
            ]
        }
    ]
};

const polarData = {
    datasets: [{
        data: [
            11,
            16,
            7,
            3,
            14
        ],
        backgroundColor: [
            '#FF6384',
            '#4BC0C0',
            '#FFCE56',
            '#E7E9ED',
            '#36A2EB'
        ],
        label: 'My dataset' // for legend
    }],
    labels: [
        'Not Interested',
        'Less Interested',
        'Neutral',
        'Interested',
        'Most Interested'
    ]
};

const radarData = {
    labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: 'rgba(179,181,198,0.2)',
            borderColor: 'rgba(179,181,198,1)',
            pointBackgroundColor: 'rgba(179,181,198,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(179,181,198,1)',
            data: [65, 59, 90, 81, 56, 55, 40]
        },
        {
            label: 'My Second dataset',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            pointBackgroundColor: 'rgba(255,99,132,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(255,99,132,1)',
            data: [28, 48, 40, 19, 96, 27, 100]
        }
    ]
};

export class InfoBox extends Component {

    render() {
        return (
            <>
                {/* <h1> Performance Charts </h1>
                <Row>
                    <Col>
                        <Doughnut data={doughnutData} />
                    </Col>
                    <Col>
                        <Bubble data={bubbleData} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Polar data={polarData} />
                    </Col>
                    <Col>
                        <Radar data={radarData} />
                    </Col>
                </Row> */}
                <MainDiv>
                    <CardDiv style={{}}>
                        <Card style={{ width: '100%' }}>
                            <Card.Body>
                                <Card.Title>Stack Share</Card.Title>
                                <Doughnut data={doughnutData} />
                            </Card.Body>
                        </Card>
                        <Card style={{ width: '100%' }}>
                            <Card.Body>
                                <Card.Title>HANA EDGE</Card.Title>
                                <div style={{ "display": "flex", "justifyContent": "center" }}>
                                    <iframe title="hanaEdge" width="560" height="315" src="https://www.youtube-nocookie.com/embed/v0wiWJETQVw" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                </div>
                            </Card.Body>
                        </Card>
                        <Card style={{ width: '100%' }}>
                            <Card.Body>
                                <Card.Title>User Sentiment</Card.Title>
                                <Polar data={polarData} />
                            </Card.Body>
                        </Card>
                    </CardDiv>
                </MainDiv>
            </>
        )
    }
}