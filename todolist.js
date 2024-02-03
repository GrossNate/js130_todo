/** Class representing a todo item. */
class Todo {
  static DONE_MARKER = "X";
  static UNDONE_MARKER = " ";

  #title;
  #done;
  #stateChangeArr;

  constructor(title) {
    this.#title = title;
    this.#done = false;
    this.#stateChangeArr = new Map();
    this.#stateChangeArr.set(Date(), "created");
  }

  toString() {
    let marker = this.isDone() ? Todo.DONE_MARKER : Todo.UNDONE_MARKER;
    return `[${marker}] ${this.#title}`;
  }

  toVerboseString() {
    const changeLogStringArr = [];
    this.#stateChangeArr.forEach((event, date) =>
      changeLogStringArr.push(`${date} ${event}`)
    );
    return this.toString() + "\n" +
      `Changes:\n${changeLogStringArr.join("\n")}`;
  }

  markDone() {
    if (!this.isDone()) {
      this.#done = true;
      this.#stateChangeArr.set(Date(), "marked done");
    }
  }

  markUndone() {
    if (this.isDone()) {
      this.#done = false;
      this.#stateChangeArr.set(Date(), "marked undone");
    }
  }

  isDone() {
    return this.#done;
  }

  getTitle() {
    return this.#title;
  }
}

class TodoList {
  #title;
  #todos;

  constructor(title, todos = []) {
    this.#title = title;
    this.#todos = todos;
  }

  getTitle() {
    return this.#title;
  }

  /** @param {Todo} todo */
  add(todo) {
    if (!(todo instanceof Todo)) {
      throw new TypeError("can only add Todo objects");
    }
    this.#todos.push(todo);
  }

  size() {
    return this.#todos.length;
  }

  first() {
    return this.#todos[0];
  }

  last() {
    return this.#todos[this.size() - 1];
  }

  /** @returns {Todo} */
  itemAt(index) {
    if (!(index in this.#todos)) {
      throw new ReferenceError(`invalid index: ${index}`);
    }
    return this.#todos[index];
  }

  markDoneAt(index) {
    this.itemAt(index).markDone();
  }

  markUndoneAt(index) {
    this.itemAt(index).markUndone();
  }

  isDone() {
    return this.#todos.every((todo) => todo.isDone());
  }

  /** @returns {Todo} */
  shift() {
    return this.#todos.shift();
  }

  pop() {
    return this.#todos.pop();
  }

  removeAt(index) {
    const returnItem = this.itemAt(index);
    this.#todos.splice(index, 1);
    return returnItem;
  }

  toString() {
    return `--- ${this.#title} ---\n` +
      this.#todos.map((todo) => todo.toString()).join("\n");
  }

  toVerboseString() {
    return `--- ${this.#title} ---\n` +
      this.#todos.map((todo) => todo.toVerboseString()).join("\n");
  }

  /**
   * @callback arrayLikeMethodCallback
   * @param {*} element
   * @param {number} index
   * @param {TodoList} todoList}
   */
  /**
   * @param {arrayLikeMethodCallback} callbackFn
   * @param {*=} thisArg
   */
  forEach(callbackFn, thisArg) { // TODO: Should this be private?
    this.#todos.forEach(callbackFn, thisArg);
  }

  /**
   * @param {arrayLikeMethodCallback} callbackFn
   * @param {*=} thisArg
   * @returns {TodoList}
   */
  filter(callbackFn, thisArg) { // TODO: Should this be private?
    const filteredTodoList = new TodoList(this.getTitle());
    this.forEach((element, index, todoList) => {
      if (callbackFn.call(thisArg, element, index, todoList)) {
        filteredTodoList.add(element);
      }
    });
    return filteredTodoList;
  }

  /** @returns {Todo} */
  findByTitle(title) {
    return this.filter((todo) => todo.getTitle() === title).first();
  }

  allDone() {
    return this.filter((todo) => todo.isDone());
  }

  allNotDone() {
    return this.filter((todo) => !todo.isDone());
  }

  markDone(title) {
    (this.findByTitle(title) || new Todo()).markDone(); // Is this terrible?
  }

  markAllDone() {
    this.forEach((todo) => todo.markDone());
  }

  markAllUndone() {
    this.forEach((todo) => todo.markUndone());
  }

  /** @returns {Array<Todo>} */
  toArray() {
    const arrayOfTodos = [];
    this.forEach((todo) => arrayOfTodos.push(todo));
    return arrayOfTodos;
  }
}

