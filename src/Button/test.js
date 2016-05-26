/* eslint-env mocha */

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Button from './';

describe('Button', () => {
    it('is a button', () => {
        const button = shallow(<Button>button</Button>);

        expect(button.is('button.button')).to.be.true;
    });

    it('accepts name prop', () => {
        const button = shallow(<Button name="my-button">button</Button>);

        expect(button.prop('name')).to.equal('my-button');
    });

    it('accepts type prop', () => {
        const button = shallow(<Button type="submit">button</Button>);

        expect(button.hasClass('button_type_submit')).to.be.true;
    });

    it('accepts view prop', () => {
        const button = shallow(<Button view="action">button</Button>);

        expect(button.hasClass('button_view_action')).to.be.true;
    });

    it('accepts className prop', () => {
        const button = shallow(<Button className="my-button">button</Button>);

        expect(button.hasClass('my-button')).to.be.true;
    });

    it('accepts checked prop', () => {
        const button = shallow(<Button checked>button</Button>);

        expect(button.hasClass('button_checked')).to.be.true;

        button.setProps({ checked: false });

        expect(button.hasClass('button_checked')).to.be.false;
    });

    it('accepts disabled prop', () => {
        const button = shallow(<Button disabled>button</Button>);

        expect(button.prop('disabled')).to.be.true;
        expect(button.hasClass('button_disabled')).to.be.true;

        button.setProps({ disabled: false });

        expect(button.prop('disabled')).to.not.be.ok;
        expect(button.hasClass('button_disabled')).to.be.false;
    });

    it('accepts focused prop', () => {
        const button = shallow(<Button focused>button</Button>);

        expect(button.hasClass('button_focused')).to.be.true;
    });

    it('removes focused if receives disabled', () => {
        const button = shallow(<Button focused>button</Button>);

        button.setProps({ disabled: true });

        expect(button.hasClass('button_focused')).to.be.false;
    });

    describe('type link', () => {
        it('is a link', () => {
            const button = shallow(<Button type="link">button</Button>);

            expect(button.is('a.button')).to.be.true;
            expect(button.prop('role')).to.equal('link');
        });

        it('has an href if has url prop', () => {
            const button = shallow(
                <Button type="link" url="http://yandex.com">button</Button>
            );

            expect(button.prop('href')).to.equal('http://yandex.com');
        });

        it('does not have an href if initially disabled', () => {
            const button = shallow(
                <Button type="link" url="http://yandex.com" disabled>button</Button>
            );

            expect(button.prop('href')).to.be.null;
        });

        it('removes/restores href on being disabled/enabled', () => {
            const button = shallow(
                <Button type="link" url="http://yandex.com">button</Button>
            );

            button.setProps({ disabled: true });
            expect(button.prop('href')).to.be.null;

            button.setProps({ disabled: false });
            expect(button.prop('href')).to.equal('http://yandex.com');
        });
    });

    describe('hoverable', () => {
        it('is hovered on mouseenter/mouseleave', () => {
            const button = shallow(<Button>button</Button>);

            button.simulate('mouseenter');
            expect(button.state('hovered')).to.be.true;
            expect(button.hasClass('button_hovered')).to.be.true;

            button.simulate('mouseleave');
            expect(button.state('hovered')).to.not.be.ok;
            expect(button.hasClass('button_hovered')).to.be.false;
        });

        it('can not be hovered if disabled', () => {
            const button = shallow(<Button disabled>button</Button>);

            button.simulate('mouseenter');
            expect(button.state('hovered')).to.not.be.ok;
        });
    });

    describe('pressable', () => {
        it('is pressed on mousedown/mouseup', () => {
            const button = shallow(<Button>button</Button>);

            button.simulate('mousedown');
            expect(button.state('pressed')).to.be.true;
            expect(button.hasClass('button_pressed')).to.be.true;

            button.simulate('mouseup');
            expect(button.state('pressed')).to.not.be.ok;
            expect(button.hasClass('button_pressed')).to.be.false;
        });

        it('is pressed on keydown with space or enter if focused', () => {
            const button = shallow(<Button focused>button</Button>);

            expect(button.state('pressed')).to.not.be.ok;

            button.simulate('keydown', { key: 'q' });
            expect(button.state('pressed')).to.not.be.ok;
            button.simulate('keyup');

            button.simulate('keydown', { key: ' ' });
            expect(button.state('pressed')).to.be.true;
            button.simulate('keyup');
            expect(button.state('pressed')).to.not.be.ok;

            button.simulate('keydown', { key: 'Enter' });
            expect(button.state('pressed')).to.be.true;
            button.simulate('keyup');
            expect(button.state('pressed')).to.not.be.ok;
        });

        it('can not be pressed if disabled', () => {
            const button = shallow(<Button disabled>button</Button>);

            button.simulate('mousedown');
            expect(button.state('pressed')).to.not.be.ok;

            button.simulate('keydown', { key: ' ' });
            expect(button.state('pressed')).to.not.be.ok;

            button.simulate('keydown', { key: 'Enter' });
            expect(button.state('pressed')).to.not.be.ok;
        });

        it('reacts on keydown, keyup if focused', () => {
            const spy1 = sinon.spy();
            const spy2 = sinon.spy();
            const button = shallow(
                <Button focused onKeyDown={spy1} onKeyUp={spy2}>button</Button>
            );

            button.simulate('keydown', { key: 'LeftArrow' });
            expect(spy1.calledOnce).to.be.true;
            expect(spy1.calledWithMatch({ key: 'LeftArrow' })).to.be.true;

            button.simulate('keyup', { key: 'LeftArrow' });
            expect(spy2.calledOnce).to.be.true;
            expect(spy2.calledWithMatch({ key: 'LeftArrow' })).to.be.true;
        });

        it('does not reacts on keydown, keyup if disabled', () => {
            const spy1 = sinon.spy();
            const spy2 = sinon.spy();
            const button = shallow(
                <Button disabled onKeyDown={spy1} onKeyUp={spy2}>button</Button>
            );

            button.simulate('keydown', { key: 'LeftArrow' });
            expect(spy1.called).to.be.false;

            button.simulate('keyup', { key: 'LeftArrow' });
            expect(spy2.called).to.be.false;
        });

        it('reacts on keypress', () => {
            const spy = sinon.spy();
            const button = shallow(
                <Button onKeyPress={spy}>button</Button>
            );

            button.simulate('keypress', { key: 'q' });
            expect(spy.calledOnce).to.be.true;
            expect(spy.calledWithMatch({ key: 'q' })).to.be.true;
        });
    });

    describe('click', () => {
        it('reacts on click', () => {
            const spy = sinon.spy();
            const button = shallow(
                <Button onClick={spy}>button</Button>
            );

            button
                .simulate('mousedown')
                .simulate('mouseup');

            expect(spy.calledOnce).to.be.true;
        });

        it('reacts on keypress by enter or space', () => {
            const spy = sinon.spy();
            const button = shallow(
                <Button onClick={spy} focused>button</Button>
            );

            button
                .simulate('keydown', { key: 'Enter' })
                .simulate('keyup')
                .simulate('keydown', { key: ' ' })
                .simulate('keyup');

            expect(spy.calledTwice).to.be.true;
        });

        it('does not react on click if disabled', () => {
            const spy = sinon.spy();
            const button = shallow(
                <Button disabled onClick={spy}>button</Button>
            );

            button
                .simulate('mousedown')
                .simulate('mouseup');

            expect(spy.called).to.be.false;
        });
    });
});