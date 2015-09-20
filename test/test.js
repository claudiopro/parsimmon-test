// Based on https://github.com/jneen/parsimmon#quick-example
var regex = Parsimmon.regex;
var string = Parsimmon.string;
var optWhitespace = Parsimmon.optWhitespace;
var lazy = Parsimmon.lazy;

function lexeme(p) { return p.skip(optWhitespace); }

var lparen = lexeme(string('('));
var rparen = lexeme(string(')'));

var expr = lazy('an s-expression', function() { return form.or(atom) });
var expr2 = lazy('an s-expression', function() { return form2.or(operator) });

var number = lexeme(regex(/[0-9]+/).map(parseInt));
var id = lexeme(regex(/[a-z_]\w*/i));
var op = lexeme(regex(/[\+\*\/\-]\w*/i));

var atom = number.or(id);
var operator = number.or(op);
var form = lparen.then(expr.many()).skip(rparen);
var form2 = lparen.then(expr2.many()).skip(rparen);

describe('the parser', function() {
  it('parses a scalar value', function() {
    expect(expr.parse('3').value).toEqual(3);
  });

  it('parses a complex expression', function() {
    var value = expr.parse('(add (mul 10 (add 3 4)) (add 7 8))').value;
    expect(value[0]).toEqual('add');
    expect(value[1][0]).toEqual('mul');
    expect(value[1][1]).toEqual(10);
    expect(value[1][2][0]).toEqual('add');
    expect(value[1][2][1]).toEqual(3);
    expect(value[1][2][2]).toEqual(4);
    expect(value[2]).toEqual(['add', 7, 8]);
  });

  it('parses a symbolic expression', function() {
    var value = expr2.parse('(+ (* 10 (+ 3 4)) (+ 7 8))').value;
    expect(value[0]).toEqual('+');
    expect(value[1][0]).toEqual('*');
    expect(value[1][1]).toEqual(10);
    expect(value[1][2][0]).toEqual('+');
    expect(value[1][2][1]).toEqual(3);
    expect(value[1][2][2]).toEqual(4);
    expect(value[2]).toEqual(['+', 7, 8]);
  });

});
