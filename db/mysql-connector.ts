import * as _ from 'lodash';
import * as bb from 'bluebird';
import * as moment from 'moment';
import * as config from 'config';
import * as g from 'ger';
import * as req from 'ger_mysql_esm';

var MysqlESM = req.esm;
var knexdb = req.knex;
var GER = g.GER;
var NamespaceDoestNotExist = GER.NamespaceDoestNotExist;


const default_namespace = 'default'

export const last_week = moment().subtract(7, 'days')
export const three_days_ago = moment().subtract(2, 'days')
export const two_days_ago = moment().subtract(2, 'days')
export const yesterday = moment().subtract(1, 'days')
export const soon = (<any>moment()).add(50, 'mins')
export const today = moment()
export const now = today
export const tomorrow = moment().add(1, 'days')
export const next_week = moment().add(7, 'days')

export const knexInst = knexdb({
    client: 'mysql',
    pool: { min: 5, max: 20 },
    connection: {
        host: config.get("db.mysql.dbHost"),
        user: config.get("db.mysql.dbUserName"),
        password: config.get("db.mysql.dbPassword"),
        timezone: 'utc',
        charset: 'utf8'
    }
});

export const init_ger = () => {
    var esm = new MysqlESM({ knex: knexInst })
    return new GER(esm);
}
