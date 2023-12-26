from flask import Blueprint, render_template, request, abort, jsonify, flash, redirect
from flask_login import login_user, login_required, logout_user
from werkzeug.security import generate_password_hash, check_password_hash


rgz = Blueprint('rgz', __name__) 

goods = [
    {'articul': '34834839', 'name': 'Стиральная машина', 'count': 2},
    {'articul': '85949334', 'name': 'Электрический чайник', 'count': 10},
    {'articul': '64789204', 'name': 'Мультиварка', 'count': 6},
]

orders = []

@rgz.route('/') 
def main(): 
    return render_template('index.html') 

@rgz.route('/rgz/goods') 
@login_required
def main_g(): 
    return render_template('goods.html') 

@rgz.route('/rgz/orders') 
@login_required
def main_o(): 
    return render_template('orders.html') 

@rgz.route('/rgz/api/goods/', methods=['GET']) 
def get_goods(): 
    return jsonify(goods)

@rgz.route('/rgz/api/goods/<int:good_num>', methods=['GET']) 
def get_good(good_num): 
    if good_num-1 > len(goods): 
        abort(404) 
    return goods[good_num]

@rgz.route('/rgz/api/goods/<int:good_num>', methods=['DELETE']) 
def del_good(good_num): 
    if good_num-1 > len(goods): 
        abort(404) 
    del goods[good_num] 
    return '', 204 

@rgz.route('/rgz/api/goods/<int:good_num>', methods=['PUT']) 
def put_good(good_num): 
    if good_num-1 > len(goods): 
        abort(404) 
    good = request.get_json() 
    goods[good_num] = good 
    return goods[good_num]

@rgz.route('/rgz/api/goods/', methods=['POST']) 
def add_good(): 
    good = request.get_json() 
    for g in goods:
        if g['articul'] == good['articul']:
            g['count'] += int(good['count'])
        goods.append(good) 
    return {'num': len(orders)-1}

@rgz.route('/rgz/api/orders/', methods=['GET'])
def get_orders():
    return jsonify(orders)

@rgz.route('/rgz/api/orders/', methods=['POST'])
def add_order():
    order = request.get_json()
    for product in order['products']:
        for g in goods:
            if product['articul'] == g['articul']:
                if int(product['count']) > g['count']:
                    return jsonify({'error': 'Недостаточно товара на складе'})
    order['status'] = 'неоплачен'
    orders.append(order)
    for product in order['products']:
        for g in goods:
            if product['articul'] == g['articul']:
                g['count'] -= int(product['count'])
    return jsonify({'num': len(orders)-1})

@rgz.route('/rgz/api/orders/<int:order_num>', methods=['PUT'])
def update_order(order_num):
    if order_num >= len(orders):
        abort(404)
    order = orders[order_num]
    for product in order['products']:
        for g in goods:
            if product['articul'] == g['articul']:
                if int(product['count']) > g['count']:
                    return jsonify({'error': 'Недостаточно товара на складе'})
    order['status'] = 'оплачен'
    for product in order['products']:
        for g in goods:
            if product['articul'] == g['articul']:
                g['count'] -= int(product['count'])
    return jsonify(order)

