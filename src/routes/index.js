/**
 * Created by 叶子 on 2017/8/13.
 */
import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import AllComponents from '../components';
import routesConfig from './config';
import queryString from 'query-string';


export default class CRouter extends Component {
    requireAuth = (permission, component) => {
        const { auth } = this.props;
        const { permissions } = auth.data;
        // const { auth } = store.getState().httpData;
        if (!permissions || !permissions.includes(permission)) return <Redirect to={'404'} />;
        return component;
    };
    requireLogin = (component, permission) => {
        const { auth } = this.props;
        const { permissions } = auth.data;
        if (process.env.NODE_ENV === 'production' && !permissions) {
            // 线上环境判断是否登录
            return <Redirect to={'/login'} />;
        }
        return permission ? this.requireAuth(permission, component) : component;
    };
    
    // 扁平化 subsNav
    flattenedSubs = (subs) => {
        let res = []
        function flattening(subs) {
            subs.forEach(v => {
                if(v.component) {
                    res.push(v)
                }
                if(v.subs) {
                    flattening(v.subs)
                }
            })
            // map = 扁平化数组有误 ？ 面试问问
            // return subs.map(v => {
            //     // debugger
            //     if(v.component) {
            //         return v
            //     }
            //     if(v.hasOwnProperty('subs')) {
            //         flattening(v.subs)
            //     }
            // })
        }
        flattening(subs)
        
        return res
    }
	
    render() {
		console.log(routesConfig)
		console.log(AllComponents)
        return (
            <Switch>
                {Object.keys(routesConfig).map(key =>
                    routesConfig[key].map(r => {
                        // console.log(r)
                        // debugger
                        const route = r => {
                            const Component = AllComponents[r.component];
                            return (
                                <Route
                                    key={r.route || r.key}
                                    exact
                                    path={r.route || r.key}
                                    render={props => {
                                        const reg = /\?\S*/g;
                                        // 匹配?及其以后字符串
                                        const queryParams = window.location.hash.match(reg);
                                        // 去除?的参数
                                        const { params } = props.match;
                                        Object.keys(params).forEach(key => {
                                            params[key] =
                                                params[key] && params[key].replace(reg, '');
                                        });
                                        props.match.params = { ...params };
                                        const merge = {
                                            ...props,
                                            query: queryParams
                                                ? queryString.parse(queryParams[0])
                                                : {},
                                        };
                                        // 重新包装组件
                                        const wrappedComponent = (
                                            <DocumentTitle title={r.title}>
                                                <Component {...merge} />
                                            </DocumentTitle>
                                        );
                                        return r.login
                                            ? wrappedComponent
                                            : this.requireLogin(wrappedComponent, r.auth);
                                    }}
                                />
                            );
                        };
                        let s
						if(r.component) {
                            s = route(r)
                        } else {
                            let oneDimensionSubs = this.flattenedSubs(r.subs)
                            // 路由更新 - 解决潜逃路由访问
                            s = oneDimensionSubs.map(r => route(r))
                        }
						return s
                        // return r.component ? route(r) : r.subs.map(r => route(r));
                    })
                )}

                <Route render={() => <Redirect to="/404" />} />
            </Switch>
        );
    }
}
