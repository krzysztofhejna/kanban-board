'use strict';
(function () {
  document.addEventListener('DOMContentLoaded', function() {
    function randomString() {
      var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
      var str = '';
      for (var i = 0; i < 10; i++) {
          str += chars[Math.floor(Math.random() * chars.length)];
      }
      return str;
    }

    function generateTemplate(name, data, basicElement) {
      var template = document.getElementById(name).innerHTML;
      var element = document.createElement(basicElement || 'div');
    
      Mustache.parse(template);
      element.innerHTML = Mustache.render(template, data);
    
      return element;
    }

    function initSortable(id) {
      var el = document.getElementById(id);
      var sortable = Sortable.create(el, {
        group: 'kanban',
        sort: true,
      });
    }
    
    var board = {
      name: 'Kanban Board',
      addColumn: function(column) {
        this.element.appendChild(column.element);
        initSortable(column.id);
      },
      element: document.querySelector('#board .column-container')
    };

    document.querySelector('#board .btn-new-column').addEventListener('click', function() {
      var name = prompt('Enter a column name');
      var column = new Column(name);
      board.addColumn(column);
    });

    function Column(name) {
      var self = this;
    
      this.id = randomString();
      this.name = name;
      this.element = generateTemplate('column-template', { name: this.name, id: this.id });

      this.element.querySelector('.column').addEventListener('click', function (event) {
        if (event.target.classList.contains('column__btn-delete')) {
          self.removeColumn();
        }
      
        if (event.target.classList.contains('btn-new-card')) {
          var input = prompt("Enter the name of the card");
          if (!input) {
            return;
          }
          self.addCard(new Card(input));
        }
      });
    }

    Column.prototype = {
      addCard: function(card) {
        this.element.querySelector('ul').appendChild(card.element);
      },
      removeColumn: function() {
        this.element.remove();
      }
    };

    function Card(description) {
      var self = this;
    
      this.id = randomString();
      this.description = description;
      this.element = generateTemplate('card-template', { description: this.description }, 'li');

      this.element.querySelector('.card').addEventListener('click', function (event) {
        event.stopPropagation();
      
        if (event.target.classList.contains('card__btn-delete')) {
          self.removeCard();
        }
      });
    }

    Card.prototype = {
      removeCard: function() {
        this.element.parentNode.removeChild(this.element);
        }
    }
    
    // CREATING COLUMNS
    var todoColumn = new Column('To do');
    var doingColumn = new Column('Doing');
    var doneColumn = new Column('Done');

    // ADDING COLUMNS TO THE BOARD
    board.addColumn(todoColumn);
    board.addColumn(doingColumn);
    board.addColumn(doneColumn);

    // CREATING CARDS
    var card1 = new Card('Clean the kitchen');
    var card2 = new Card('Buy a Christmas gift for my mom');
    var card3 = new Card('Lose 10 kilo'); 
    var card4 = new Card('Finish Kodilla Web Dev Course');
    var card5 = new Card('Win a lottery');

    // ADDING CARDS TO COLUMNS
    todoColumn.addCard(card1);
    todoColumn.addCard(card4);
    todoColumn.addCard(card5);
    doingColumn.addCard(card3);
    doneColumn.addCard(card2);  
  });
})();