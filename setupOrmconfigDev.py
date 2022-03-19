import sys

ormconfig = 'ormconfig.js'

ormconfigLines = ['ssl: {', '    rejectUnauthorized: false', '},']

def commentFile(filename, lines, sysarg):
    file = open(filename,"rt")
    data = file.read()

    if '//  ' in data:
        data = data.replace('//  ', '')

    if(sysarg == '1'):
        #comment lines
        for line in lines:
            data = data.replace(line, '//  ' + line)
    else:
        #uncomment lines
        for line in lines:
            data = data.replace('//  ' + line, line)
    
    file.close()
    newFile = open(filename,'wt')
    newFile.write(data)
    newFile.close()

commentFile(ormconfig, ormconfigLines, sys.argv[1])
