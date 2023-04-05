from setuptools import setup

setup(
    name='lx',
    version='1.0.0',
    py_modules=['program'],
    entry_points={
        'console_scripts': [
            'lx = program:main'
        ]
    }
)