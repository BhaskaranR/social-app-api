'use strict';
import * as Joi from 'joi';
import * as schema from './validation';

export const newTextMessage = (message, next) => {
    Joi.validate(message.data, schema.textMessage, (err, messageData) => {
        if (err) {
            return next(err);
        }
        if (!messageData.message_type) {
            messageData.message_type = 'text';
        }
        console.time('creating new message');
        helper.getMessageObject(messageData)
            .then(res => {
                console.timeEnd('creating new message');
                return res;
            })
            .then(result => db.insertOne(result, 'messages'))
            .then(dbResponse =>
                next(null, {
                    data: {
                        _id: dbResponse.insertedId
                    }
                }))
            .catch(next);
    });
};

export const newPostMessage = (message, next) => {
    Joi.validate(message.data, schema.postMessage, (err, messageData) => {
        if (err) {
            return next(err);
        }
        messageData.message_type = 'post';

        db.insertOne(messageData, 'messages')
            .then(dbResponse => next(null, {
                data: {
                    _id: dbResponse.insertedId
                }
            }))
            .catch(next);
    });
};

export const getMessagesByConversationId = (message, next) => {
    Joi.validate(message.data, schema.messagesByConversationId, (err, messageData) => {

        if (err) {
            return next(err);
        }
        if (!messageData.query) {
            messageData.query = {};
            messageData.query.elements = 100;
            messageData.query.page = 0;
        }

        db.findMessagesByConversationId(messageData.conversation_id, messageData.query)
            .then(dbResponse => next(null, { data: dbResponse }))
            .catch(next);
    });
};

export const getLatestMessagesByDistinctConversation = (message, next) => {
    Joi.validate(message.data, schema.latestMessages, (err, messageData) => {

        if (err) {
            return next(err);
        }
        if (!messageData.query) {
            messageData.query = {};
            messageData.query.count = 3;
        }

        db.findLatestMessagesByDistinctConversation(messageData.user_id, messageData.query)
            .then(dbResponse => next(null, { data: dbResponse }))
            .catch(next);
    });
};