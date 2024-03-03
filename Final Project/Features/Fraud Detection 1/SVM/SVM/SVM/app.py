from flask import Flask, render_template, request
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import PowerTransformer
from imblearn.over_sampling import SMOTE
from sklearn.svm import SVC
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import pickle

app = Flask(__name__)

def total_fraud_transactions(predictions):
    return predictions.sum()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if request.method == 'POST':
        file = request.files['file']
        if file:
            df = pd.read_csv(file)
            # Data cleaning and processing
            df = df.iloc[:, 2:]
            df.drop(df.select_dtypes('O').columns, axis=1, inplace=True)
            df.fillna(df.median(), inplace=True)
            df.drop(df.columns[df.var() == 0], axis=1, inplace=True)
            drop = ['total transactions (including tnx to create contract', 'total ether sent contracts', 'max val sent to contract', ' ERC20 avg val rec',
                    ' ERC20 avg val rec',' ERC20 max val rec', ' ERC20 min val rec', ' ERC20 uniq rec contract addr', 'max val sent', ' ERC20 avg val sent',
                    ' ERC20 min val sent', ' ERC20 max val sent', ' Total ERC20 tnxs', 'avg value sent to contract', 'Unique Sent To Addresses',
                    'Unique Received From Addresses', 'total ether received', ' ERC20 uniq sent token name', 'min value received', 'min val sent', ' ERC20 uniq rec addr' ]
            df.drop(drop, axis=1, inplace=True)
            y = df.iloc[:, 0]
            X = df.iloc[:, 1:]
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=123)
            norm = PowerTransformer()
            norm_train_f = norm.fit_transform(X_train)
            oversample = SMOTE()
            x_tr_resample, y_tr_resample = oversample.fit_resample(norm_train_f, y_train)
            svm_clf = SVC(random_state=42)
            svm_clf.fit(x_tr_resample, y_tr_resample)
            norm_test_f = norm.transform(X_test)
            preds_svm = svm_clf.predict(norm_test_f)
            accuracy = accuracy_score(y_test, preds_svm)
            pickle_out = open('SVM_FRAUD.pickle', 'wb')
            pickle.dump(svm_clf, pickle_out)
            pickle_out.close()
            pickle_in = open('SVM_FRAUD.pickle', 'rb')
            svm_clf_loaded = pickle.load(pickle_in)
            pickle_in.close()
            norm_X = norm.transform(X)
            X_resample, y_resample = oversample.fit_resample(norm_X, y)
            predictions = svm_clf_loaded.predict(norm_X)
            fraud_transactions = df[predictions == 1]
            total_fraud = total_fraud_transactions(predictions)
            return render_template('result.html', total_fraud=total_fraud, fraud_transactions=fraud_transactions.to_html())
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
