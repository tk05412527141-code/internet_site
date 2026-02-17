import re

def check_balance(filename):
    with open('debug_balance.txt', 'w', encoding='utf-8') as log_file:
        def log(msg):
            log_file.write(msg + '\n')
            print(msg)

        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()

        stack = []
        line_num = 1
        col_num = 1
        in_string = False
        string_char = ''
        in_comment_line = False
        in_comment_block = False
        
        i = 0
        while i < len(content):
            char = content[i]
            
            # Handle Newlines
            if char == '\n':
                line_num += 1
                col_num = 1
                in_comment_line = False
                i += 1
                continue
                
            # Handle Comments
            if not in_string and not in_comment_block and not in_comment_line:
                if char == '/' and i+1 < len(content):
                    if content[i+1] == '/':
                        in_comment_line = True
                        i += 2
                        col_num += 2
                        continue
                    elif content[i+1] == '*':
                        in_comment_block = True
                        i += 2
                        col_num += 2
                        continue
            
            if in_comment_line:
                i += 1
                col_num += 1
                continue
                
            if in_comment_block:
                if char == '*' and i+1 < len(content) and content[i+1] == '/':
                    in_comment_block = False
                    i += 2
                    col_num += 2
                else:
                    i += 1
                    col_num += 1
                continue
                
            # Handle Strings
            if char in ["'", '"', '`']:
                if not in_string:
                    in_string = True
                    string_char = char
                elif char == string_char:
                    # Check for escaped quote (very simple check)
                    if i > 0 and content[i-1] != '\\':
                        in_string = False
                i += 1
                col_num += 1
                continue
                
            if in_string:
                i += 1
                col_num += 1
                continue
                
            # Check Braces
            if char in ['(', '{', '[']:
                stack.append((char, line_num, col_num))
            elif char in [')', '}', ']']:
                if not stack:
                    log(f"Error: Unexpected closing '{char}' at line {line_num} col {col_num}")
                    return
                
                last, last_line, last_col = stack.pop()
                
                # DEBUG: Check if main block closed
                if last_line == 1 and last == '{':
                    log(f"DEBUG: Main block {{ from line 1 closed at line {line_num} col {col_num}")

                expected = {'(': ')', '{': '}', '[': ']'}[last]
                if char != expected:
                    log(f"Error: Expected '{expected}' to close '{last}' (from line {last_line}), but found '{char}' at line {line_num} col {col_num}")
                    return
            
            i += 1
            col_num += 1
            
        if stack:
            first, line, col = stack[0]
            log(f"Error: Unclosed '{first}' from line {line} col {col}")
        else:
            log("Balance Check Passed")

if __name__ == "__main__":
    check_balance('public/js/app.js.bak')
