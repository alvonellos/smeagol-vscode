"use strict";

const vscode = require("vscode");

/**
 * VS Code API Helper Functions
 * Centralized wrapper for all VS Code API calls
 */

/**
 * Create a text editor decoration type
 */
function createDecoration(backgroundColor, borderColor, borderWidth, borderRadius, overviewRulerColor) {
  return vscode.window.createTextEditorDecorationType({
    backgroundColor,
    border: borderColor && borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : undefined,
    borderRadius: borderRadius ? `${borderRadius}px` : undefined,
    overviewRulerColor,
    isWholeLine: false
  });
}

/**
 * Create a line-based decoration type
 */
function createLineDecoration(backgroundColor, borderColor, borderWidth, borderRadius) {
  return vscode.window.createTextEditorDecorationType({
    backgroundColor,
    border: borderColor && borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : undefined,
    borderRadius: borderRadius ? `${borderRadius}px` : undefined,
    isWholeLine: true
  });
}

/**
 * Set decorations on an editor
 */
function setDecorations(editor, decoration, ranges) {
  if (editor && decoration) {
    editor.setDecorations(decoration, ranges || []);
  }
}

/**
 * Get the current configuration
 */
function getConfiguration(section = 'smeagol') {
  return vscode.workspace.getConfiguration(section);
}

/**
 * Subscribe to configuration changes
 */
function onConfigurationChanged(callback) {
  return vscode.workspace.onDidChangeConfiguration(callback);
}

/**
 * Subscribe to text document changes
 */
function onDidChangeTextDocument(callback) {
  return vscode.workspace.onDidChangeTextDocument(callback);
}

/**
 * Subscribe to editor visibility changes
 */
function onDidChangeVisibleTextEditors(callback) {
  return vscode.window.onDidChangeVisibleTextEditors(callback);
}

/**
 * Subscribe to active editor changes
 */
function onDidChangeActiveTextEditor(callback) {
  return vscode.window.onDidChangeActiveTextEditor(callback);
}

/**
 * Subscribe to visible range changes
 */
function onDidChangeTextEditorVisibleRanges(callback) {
  return vscode.window.onDidChangeTextEditorVisibleRanges(callback);
}

/**
 * Get all visible editors
 */
function getVisibleEditors() {
  return vscode.window.visibleTextEditors;
}

/**
 * Get current active editor
 */
function getActiveEditor() {
  return vscode.window.activeTextEditor;
}

/**
 * Create a range
 */
function createRange(startLine, startChar, endLine, endChar) {
  return new vscode.Range(startLine, startChar, endLine, endChar);
}

/**
 * Get document text for range
 */
function getDocumentText(document, range) {
  return document.getText(range);
}

/**
 * Convert offset to position
 */
function offsetToPosition(document, offset) {
  return document.positionAt(offset);
}

/**
 * Convert position to offset
 */
function positionToOffset(document, line, character) {
  return document.offsetAt(new vscode.Position(line, character));
}

module.exports = {
  createDecoration,
  createLineDecoration,
  setDecorations,
  getConfiguration,
  onConfigurationChanged,
  onDidChangeTextDocument,
  onDidChangeVisibleTextEditors,
  onDidChangeActiveTextEditor,
  onDidChangeTextEditorVisibleRanges,
  getVisibleEditors,
  getActiveEditor,
  createRange,
  getDocumentText,
  offsetToPosition,
  positionToOffset
};
