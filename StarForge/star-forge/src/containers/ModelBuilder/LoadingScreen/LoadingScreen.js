import React from 'react';

import styled from 'styled-components';
import {keyFrameExampleOne} from './Keyframes';

    const Background = styled.div`
        top: 0;
        left: 0;
        padding-top: 1em;
        background: currentcolor;
        color: #ccc;
        text-align: center;
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 100000;
        `

    const Tomato0 = styled.div`
    background: #5d809d;
    z-index: 10000;
    display: inline-block;
    width: 2em;
    height: 2em;
    border-radius: 50%;
    animation: ${keyFrameExampleOne} 1.5s calc(((0 + var(--o, 0))/6 - 1)*1.5s) infinite;

    &:after {
        display: inline-block;
        width: 2em;
        height: 2em;
        border-radius: 50%;
        animation: ${keyFrameExampleOne} 1.5s calc(((0 + var(--o, 0))/6 - 1)*1.5s) infinite;
        --o: 1;
        background: currentcolor;
        content: '';
        }
    `
    const Tomato1 = styled.div`
    background: #5d809d;
    z-index: 10000;
    display: inline-block;
    width: 2em;
    height: 2em;
    border-radius: 50%;
    animation: ${keyFrameExampleOne} 1.5s calc(((1 + var(--o, 0))/6 - 1)*1.5s) infinite;

    &:after {
        display: inline-block;
        width: 2em;
        height: 2em;
        border-radius: 50%;
        animation: ${keyFrameExampleOne} 1.5s calc(((1 + var(--o, 0))/6 - 1)*1.5s) infinite;
        --o: 1;
        background: currentcolor;
        content: '';
        }
    `
    const Tomato2 = styled.div`
    background: #5d809d;
    z-index: 10000;

    display: inline-block;
    width: 2em;
    height: 2em;
    border-radius: 50%;
    animation: ${keyFrameExampleOne} 1.5s calc(((2 + var(--o, 0))/6 - 1)*1.5s) infinite;

    &:after {
        display: inline-block;
        width: 2em;
        height: 2em;
        border-radius: 50%;
        animation: ${keyFrameExampleOne} 1.5s calc(((2 + var(--o, 0))/6 - 1)*1.5s) infinite;
        --o: 1;
        background: currentcolor;
        content: '';
        }
    `
    const Tomato3 = styled.div`
    background: #5d809d;
    z-index: 10000;
    display: inline-block;
    width: 2em;
    height: 2em;
    border-radius: 50%;
    animation: ${keyFrameExampleOne} 1.5s calc(((3 + var(--o, 0))/6 - 1)*1.5s) infinite;

    &:after {
        display: inline-block;
        width: 2em;
        height: 2em;
        border-radius: 50%;
        animation: ${keyFrameExampleOne} 1.5s calc(((3 + var(--o, 0))/6 - 1)*1.5s) infinite;
        --o: 1;
        background: currentcolor;
        content: '';
        }
    `

    const Tomato4 = styled.div`
    background: #5d809d;
    z-index: 10000;
    display: inline-block;
    width: 2em;
    height: 2em;
    border-radius: 50%;
    animation: ${keyFrameExampleOne} 1.5s calc(((4 + var(--o, 0))/6 - 1)*1.5s) infinite;

    &:after {
        display: inline-block;
        width: 2em;
        height: 2em;
        border-radius: 50%;
        animation: ${keyFrameExampleOne} 1.5s calc(((4 + var(--o, 0))/6 - 1)*1.5s) infinite;
        --o: 1;
        background: currentcolor;
        content: '';
        }
    `
    const Tomato5 = styled.div`
    background: #5d809d;
    z-index: 10000;
    display: inline-block;
    width: 2em;
    height: 2em;
    border-radius: 50%;
    animation: ${keyFrameExampleOne} 1.5s calc(((5 + var(--o, 0))/6 - 1)*1.5s) infinite;

    &:after {
        display: inline-block;
        width: 2em;
        height: 2em;
        border-radius: 50%;
        animation: ${keyFrameExampleOne} 1.5s calc(((5 + var(--o, 0))/6 - 1)*1.5s) infinite;
        --o: 1;
        background: currentcolor;
        content: '';
        }
    `
    const Container = styled.div`
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    `

export default class loadingScreen extends React.Component {
  
    render() {
      return (
        <Background>
            <Container>
                <Tomato0/>
                <Tomato1/>
                <Tomato2/>
                <Tomato3/>
                <Tomato4/>
                <Tomato5/>
            </Container>
        </Background>
      )
    }
  }